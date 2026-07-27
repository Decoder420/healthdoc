"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";

import { patients } from "@/lib/mock/lab_data";

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

interface Props {
  search: string;
  onPatientSelect?: () => void;
}

export default function SearchPatients({
  search,
  onPatientSelect,
}: Props) {
  const router = useRouter();

  const filtered = useMemo(() => {
    if (!search.trim()) return [];

    return patients
      .filter((item) => {
        const value = search.toLowerCase();

        return (
          item.patient.name.toLowerCase().includes(value) ||
          item.patient.uhid.toLowerCase().includes(value) ||
          item.doctor.name.toLowerCase().includes(value)
        );
      })
      .slice(0, 8);
  }, [search]);

  if (!search || filtered.length === 0) return null;

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
          <Box key={item.patient.patientId}>
           <ListItemButton
  onClick={() => {
    onPatientSelect?.();

    router.push(
      `/lab/patient/${item.patient.patientId}`
    );
  }}
>
              <ListItemAvatar>
                <Avatar>
                  {item.patient.name
                    .split(" ")
                    .map((x) => x[0])
                    .join("")
                    .slice(0, 2)}
                </Avatar>
              </ListItemAvatar>

              <ListItemText
                primary={item.patient.name}
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="caption"
                    >
                      {item.patient.uhid}
                    </Typography>

                    {" • "}

                    <Typography
                      component="span"
                      variant="caption"
                    >
                      {item.doctor.name}
                    </Typography>
                  </>
                }
              />
            </ListItemButton>

            {index !== filtered.length - 1 && <Divider />}
          </Box>
        ))}
      </List>
    </Paper>
  );
}