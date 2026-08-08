"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

import { ConsultationWorkspace } from "@/features/doctor";
import { getQueueToken } from "@/features/doctor/api";
import { doctorPageSx } from "@/features/doctor/panelSx";
import { encounterContextFor, mockEncounterContext } from "@/lib/mock";
import type { EncounterContext } from "@/features/doctor/types";

function ConsultationPageInner() {
  const searchParams = useSearchParams();
  const tokenId = searchParams.get("token");
  const [context, setContext] = useState<EncounterContext | null>(
    tokenId ? null : mockEncounterContext,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tokenId) {
      setContext(mockEncounterContext);
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        const patient = await getQueueToken(tokenId);
        if (cancelled) return;
        if (!patient) {
          setError("Queue token not found.");
          setContext(null);
          return;
        }
        setError(null);
        setContext(encounterContextFor(patient));
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to load encounter context");
        setContext(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [tokenId]);

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!context) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }
  return <ConsultationWorkspace context={context} />;
}

export default function Page() {
  return (
    <Box sx={doctorPageSx}>
      <Suspense
        fallback={
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress size={28} />
          </Box>
        }
      >
        <ConsultationPageInner />
      </Suspense>
    </Box>
  );
}
