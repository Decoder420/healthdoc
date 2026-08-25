"use client";

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

import { ConsultationWorkspace } from "@/features/doctor";
import { getQueueToken } from "@/features/doctor/api";
import { doctorPageSx } from "@/features/doctor/panelSx";
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
  const [message, setMessage] = useState<{ tone: "instruction" | "error"; text: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    const tokenId = new URLSearchParams(window.location.search).get("token");

    if (!tokenId) {
      setMessage({
        tone: "instruction",
        text: "Open a patient from the live OPD queue to start a consultation.",
      });
      setContext(null);
      return;
    }

    void (async () => {
      try {
        const token = await getQueueToken(tokenId);
        if (cancelled) return;
        if (!token) {
          setMessage({ tone: "error", text: "Queue token not found." });
          setContext(null);
          return;
        }
        setMessage(null);
        setContext({
          visit_id: token.visit_id,
          patient_id: token.patient_id,
          patient_name: token.full_name,
          uhid: token.uhid,
          age_years: token.age_years,
          sex: token.sex,
          provider_user_id: token.provider_user_id ?? "",
          provider_name: token.provider_name ?? "Assigned doctor",
          department: token.department ?? "OPD",
          token_display: token.token_display,
        });
      } catch (e) {
        if (cancelled) return;
        setMessage({
          tone: "error",
          text: e instanceof Error ? e.message : "Failed to load encounter context",
        });
        setContext(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Box sx={doctorPageSx}>
      {message ? (
        <Box
          role={message.tone === "error" ? "alert" : undefined}
          sx={{
            border: "1px solid",
            borderColor: message.tone === "error" ? "error.light" : "divider",
            borderRadius: 2,
            bgcolor: message.tone === "error" ? "rgba(211, 47, 47, 0.08)" : "background.paper",
            p: 3,
          }}
        >
          <Typography component="h1" sx={{ fontSize: "1.25rem", fontWeight: 700 }}>
            {message.tone === "error" ? "Consultation unavailable" : "Start a consultation"}
          </Typography>
          <Typography sx={{ mt: 1, color: "text.secondary" }}>{message.text}</Typography>
        </Box>
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
