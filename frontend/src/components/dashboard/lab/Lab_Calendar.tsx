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
      <div className="flex h-full w-full items-center justify-center">
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
            maxWidth: 300,
            maxHeight: "100%",
            "& .MuiDateCalendar-root": {
              width: "100%",
              maxHeight: 460,
            },
            "& .MuiPickersSlideTransition-root": {
              minHeight: 220,
            },
            "& .MuiPickersCalendarHeader-root": {
              marginTop: 0,
              marginBottom: 0,
              paddingLeft: 0.5,
              paddingRight: 0.5,
              minHeight: 36,
            },
            "& .MuiDayCalendar-header": {
              justifyContent: "space-around",
            },
            "& .MuiDayCalendar-weekContainer": {
              margin: 0,
              justifyContent: "space-around",
            },
            "& .MuiPickersDay-root": {
              width: 34,
              height: 34,
              margin: "1px",
              fontSize: "0.8rem",
            },
          }}
        />
      </div>
    </LocalizationProvider>
  );
}