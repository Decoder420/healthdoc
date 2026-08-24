import assert from "node:assert/strict";
import test from "node:test";

import { demoRoles } from "../e2e/demo-recordings.config.mjs";

test("demo recording matrix covers the three required roles", () => {
  assert.deepEqual(
    demoRoles.map(({ name }) => name),
    ["receptionist", "doctor", "nurse"],
  );
});

test("every demo journey has a unique landing route and bearer API proof", () => {
  assert.equal(new Set(demoRoles.map(({ landingPath }) => landingPath)).size, demoRoles.length);
  for (const role of demoRoles) {
    assert.match(role.landingPath, /^\//);
    assert.match(role.api.path, /^\/api\/v1\//);
    assert.ok(["GET", "POST"].includes(role.api.method));
  }
});
