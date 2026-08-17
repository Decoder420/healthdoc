"use client";

import { useCallback, useEffect, useState } from "react";

import { toast } from "@/components/ui/toast";
import {
  checkRecordAccess,
  requestBreakGlassGrant,
  revokeBreakGlassGrant,
  verifyStepUp,
} from "../api";
import type { RecordAccess } from "../types";

/**
 * Owns one patient's record-access decision and, when access is running on a
 * break-glass grant, the time left on it.
 *
 * The countdown is derived from the grant's `expires_at` on every tick rather
 * than decremented from a starting value. That is the whole point: a clinician
 * who reloads the page, or leaves the tab asleep for an hour, sees the true
 * remaining time instead of a fresh two hours.
 */
export function useBreakGlass(patientId: string | null) {
  const [access, setAccess] = useState<RecordAccess | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [msRemaining, setMsRemaining] = useState(0);

  const grant = access?.grant ?? null;

  const load = useCallback(async () => {
    if (!patientId) {
      setAccess(null);
      return;
    }
    setLoading(true);
    try {
      setAccess(await checkRecordAccess(patientId));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to check record access");
      setAccess(null);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    void load();
  }, [load]);

  // Tick against the server's expires_at. When it runs out, re-check access so
  // the record closes itself without the clinician doing anything.
  useEffect(() => {
    if (!grant) {
      setMsRemaining(0);
      return;
    }
    const expiresAt = Date.parse(grant.expires_at);
    let cancelled = false;

    const tick = () => {
      const left = expiresAt - Date.now();
      if (cancelled) return;
      setMsRemaining(Math.max(0, left));
      if (left <= 0) {
        toast.error("Emergency access expired.");
        void load();
      }
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [grant, load]);

  /**
   * Verify the step-up code, then open the grant. Returns an error string for
   * the form to show inline — a failed MFA code is a normal outcome, not a
   * toast-worthy fault.
   */
  const requestAccess = useCallback(
    async (justification: string, code: string): Promise<string | null> => {
      if (!patientId) return "No patient selected.";
      setSubmitting(true);
      try {
        const step = await verifyStepUp(code);
        if (!step.verified) return step.error ?? "Verification failed.";

        const created = await requestBreakGlassGrant({
          patient_id: patientId,
          justification,
        });
        setAccess({ patient_id: patientId, allowed: true, grant: created });
        toast.success("Emergency access granted — this session is being recorded.");
        return null;
      } catch (e) {
        return e instanceof Error ? e.message : "Could not open emergency access.";
      } finally {
        setSubmitting(false);
      }
    },
    [patientId],
  );

  /** Hand access back before the window runs out. */
  const revoke = useCallback(async () => {
    if (!grant) return;
    setSubmitting(true);
    try {
      await revokeBreakGlassGrant(grant.id);
      toast.success("Emergency access ended.");
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to end emergency access");
    } finally {
      setSubmitting(false);
    }
  }, [grant, load]);

  return {
    loading,
    submitting,
    /** True once we know the record is readable — by consent or by grant. */
    allowed: access?.allowed ?? false,
    blockedReason: access?.blocked_reason ?? null,
    grant,
    msRemaining,
    requestAccess,
    revoke,
  };
}
