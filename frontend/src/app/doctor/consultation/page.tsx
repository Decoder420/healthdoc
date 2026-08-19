"use client";

import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

import { ConsultationWorkspace } from "@/features/doctor";
import { getQueueToken } from "@/features/doctor/api";
import { doctorPageSx } from "@/features/doctor/panelSx";
import { encounterContextFor, mockEncounterContext } from "@/lib/mock";
import type { EncounterContext } from "@/features/doctor/types";

/**
 * The queue token is read from the URL in an effect rather than with
 * `useSearchParams`.
 *
 * `useSearchParams` suspends during prerender, and the Suspense boundary it
 * requires was leaving this route's subtree unhydrated: the markup arrived from
 * the server but no effect ever ran and no click did anything — the screen
 * looked finished and was completely dead. Reading `window.location` after
 * mount keeps the whole page a normal client tree.
 */
export default function Page() {
  const [context, setContext] = useState<EncounterContext | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const tokenId = new URLSearchParams(window.location.search).get("token");

    if (!tokenId) {
      setContext(mockEncounterContext);
      return;
    }

    void (async () => {
      try {
        const token = await getQueueToken(tokenId);
        if (cancelled) return;
        if (!token) {
          setError("Queue token not found.");
          setContext(null);
          return;
        }
        setError(null);
        setContext(encounterContextFor(token));
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to load encounter context");
        setContext(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Box sx={doctorPageSx}>
      {error ? (
        <Alert severity="error">{error}</Alert>
      ) : !context ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress size={28} />
        </Box>
      ) : (
        <ConsultationWorkspace context={context} />
      )}
    </Box>
  );
}
