"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";

import { patients as labPatients } from "@/lib/mock/lab_data";

import {
  appointmentQueue as radiologyPatients,
} from "@/components/dashboard/radiology/test_queue/DummyData";

import {
  Avatar,
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";

type SearchModule = "lab" | "radiology";

interface Props {
  search: string;
  module: SearchModule;
  onPatientSelect?: () => void;
}

type SearchResult = {
  id: string;
  patientName: string;
  uhid: string;
  secondary: string;
  module: SearchModule;

  // Used for navigation
  patientId?: string;
  orderId?: string;
};

export default function SearchPatients({
  search,
  module,
  onPatientSelect,
}: Props) {
  const router = useRouter();

  const filtered: SearchResult[] = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return [];
    }

    /*
     * ============================
     * LAB SEARCH
     * ============================
     */
    if (module === "lab") {
      return labPatients
        .filter((item) => {
          const patientName =
            item.patient?.name?.toLowerCase() ?? "";

          const uhid =
            item.patient?.uhid?.toLowerCase() ?? "";

          const doctorName =
            item.doctor?.name?.toLowerCase() ?? "";

          return (
            patientName.includes(value) ||
            uhid.includes(value) ||
            doctorName.includes(value)
          );
        })
        .slice(0, 8)
        .map((item) => ({
          id: item.patient.patientId,

          patientName: item.patient.name,

          uhid: item.patient.uhid,

          secondary: item.doctor.name,

          module: "lab" as const,

          patientId: item.patient.patientId,
        }));
    }

    /*
     * ============================
     * RADIOLOGY SEARCH
     * ============================
     */
    return radiologyPatients
      .filter((item) => {
        const patientName =
          item.patientName?.toLowerCase() ?? "";

        const uhid =
          item.uhid?.toLowerCase() ?? "";

        const accessionNumber =
          item.accessionNumber?.toLowerCase() ?? "";

        const orderId =
          item.orderId?.toLowerCase() ?? "";

        const patientId =
          item.patientId?.toLowerCase() ?? "";

        return (
          patientName.includes(value) ||
          uhid.includes(value) ||
          accessionNumber.includes(value) ||
          orderId.includes(value) ||
          patientId.includes(value)
        );
      })
      .slice(0, 8)
      .map((item) => ({
        id: `${item.patientId}-${item.orderId}`,

        patientName: item.patientName,

        uhid: item.uhid,

        secondary: `${item.accessionNumber} • ${item.modality}`,

        module: "radiology" as const,

        patientId: item.patientId,

        orderId: item.orderId,
      }));
  }, [search, module]);

  if (!search.trim() || filtered.length === 0) {
    return null;
  }

  const handlePatientSelect = (
    item: SearchResult
  ) => {
    onPatientSelect?.();

    /*
     * ============================
     * LAB
     * ============================
     */
    if (item.module === "lab") {
      if (!item.patientId) return;

      router.push(
        `/lab/patient/${item.patientId}`
      );

      return;
    }

    /*
     * ============================
     * RADIOLOGY
     * ============================
     *
     * Use orderId because one patient
     * can have multiple radiology studies.
     */
    if (!item.orderId) return;

    router.push(
      `/radiology/patient/${item.patientId}`
    );
  };

  return (
    <Paper
      elevation={8}
      sx={{
        position: "absolute",
        top: 50,
        width: "100%",
        borderRadius: 3,
        overflow: "hidden",
        zIndex: 9999,
      }}
    >
      <List disablePadding>
        {filtered.map((item, index) => (
          <Box key={item.id}>
            <ListItemButton
              onClick={() =>
                handlePatientSelect(item)
              }
            >
              <ListItemAvatar>
                <Avatar>
                  {item.patientName
                    .split(" ")
                    .map((x) => x[0])
                    .join("")
                    .slice(0, 2)}
                </Avatar>
              </ListItemAvatar>

              <ListItemText
                primary={item.patientName}
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="caption"
                    >
                      {item.uhid}
                    </Typography>

                    {" • "}

                    <Typography
                      component="span"
                      variant="caption"
                    >
                      {item.secondary}
                    </Typography>
                  </>
                }
              />
            </ListItemButton>

            {index !== filtered.length - 1 && (
              <Divider />
            )}
          </Box>
        ))}
      </List>
    </Paper>
  );
}
