"use client";

import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

type Props = {
  value: string;
  onChange: (date: string) => void;
};

export default function CalendarComponent({
  value,
  onChange,
}: Props) {
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
      />
    </LocalizationProvider>
  );
}