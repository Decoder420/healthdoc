import assert from "node:assert/strict";
import test from "node:test";

import { draftFingerprint, retryDelayMs } from "../src/lib/resilience.mjs";

test("SSE retry delay backs off and is bounded", () => {
  assert.deepEqual(
    [0, 1, 2, 3, 4, 5, 20].map((attempt) => retryDelayMs(attempt)),
    [1_000, 2_000, 4_000, 8_000, 16_000, 30_000, 30_000],
  );
  assert.throws(() => retryDelayMs(-1), /non-negative integer/);
});

test("clinical draft fingerprint tracks every persisted consultation field", () => {
  const baseline = {
    encounterType: "consultation",
    chiefComplaint: "  fever  ",
    soap: { subjective: "s", objective: "o", assessment: "a", plan: "p" },
  };
  assert.equal(
    draftFingerprint(baseline),
    draftFingerprint({ ...baseline, chiefComplaint: "fever" }),
  );
  for (const field of ["subjective", "objective", "assessment", "plan"]) {
    assert.notEqual(
      draftFingerprint(baseline),
      draftFingerprint({ ...baseline, soap: { ...baseline.soap, [field]: "changed" } }),
    );
  }
});
