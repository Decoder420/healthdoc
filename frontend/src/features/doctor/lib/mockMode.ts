/**
 * Every write in this module currently lands in memory, not on a server.
 *
 * Saying plain "Saved" would be a lie a clinician could act on — they would
 * believe the prescription is on the record when nothing left the browser.
 * Until the real endpoints are wired, every success message says so.
 *
 * Deleting this file is part of wiring the API: once a call really persists,
 * its toast should lose the suffix rather than keep a stale reassurance.
 */
export const LOCAL_ONLY_SUFFIX = "— local only, not saved to the server";

/** Wrap a success message so it cannot be mistaken for a persisted write. */
export function localOnly(message: string): string {
  return `${message} ${LOCAL_ONLY_SUFFIX}`;
}
