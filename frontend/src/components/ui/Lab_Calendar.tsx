"use client";

import dayjs, { type Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

import { meridian } from "@/styles/theme";

type Props = {
  value: string;
  onChange: (date: string) => void;
};

export default function CalendarComponent({ value, onChange }: Props) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        value={dayjs(value)}
        disableFuture
        onChange={(newValue: Dayjs | null) => {
          if (newValue) {
            onChange(newValue.format("YYYY-MM-DD"));
          }
        }}
        sx={{
          width: "100%",
          maxWidth: 320,
          "& .MuiPickersCalendarHeader-label": {
            fontWeight: 700,
            color: meridian.textPrimary,
          },
          "& .MuiDayCalendar-weekDayLabel": {
            color: meridian.textSecondary,
            fontWeight: 600,
            fontSize: "0.75rem",
          },
          "& .MuiPickersDay-root": {
            fontWeight: 600,
            color: meridian.textPrimary,
            "&.Mui-selected": {
              backgroundColor: `${meridian.brandPrimary} !important`,
              color: "#fff",
            },
            "&:hover": {
              backgroundColor: "rgb(0 31 84 / 0.08)",
            },
          },
          "& .MuiPickersDay-today": {
            border: `1px solid ${meridian.brandPrimary}`,
          },
        }}
      />
    </LocalizationProvider>
  );
}
