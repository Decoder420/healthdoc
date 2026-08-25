/** Pure resilience helpers shared by browser code and Node's built-in tests. */

export function retryDelayMs(attempt, baseMs = 1_000, maxMs = 30_000) {
  if (!Number.isInteger(attempt) || attempt < 0) {
    throw new RangeError("attempt must be a non-negative integer");
  }
  return Math.min(maxMs, baseMs * 2 ** attempt);
}

export function draftFingerprint(draft) {
  return JSON.stringify({
    encounterType: draft.encounterType,
    chiefComplaint: draft.chiefComplaint.trim(),
    subjective: draft.soap.subjective,
    objective: draft.soap.objective,
    assessment: draft.soap.assessment,
    plan: draft.soap.plan,
  });
}
