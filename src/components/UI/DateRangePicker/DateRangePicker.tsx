import { Box, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import React from "react";

interface IDateRangePickerProps {
    startDate: dayjs.Dayjs | null;
    endDate: dayjs.Dayjs | null;
    onStartDateChange: (date: dayjs.Dayjs | null) => void;
    onEndDateChange: (date: dayjs.Dayjs | null) => void;
}

const DateRangePicker: React.FC<IDateRangePickerProps> = (props: IDateRangePickerProps) => {
  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      <DatePicker
        label="Kezdő dátum"
        value={props.startDate}
        onChange={props.onStartDateChange}
        orientation="portrait"
        slotProps={{ toolbar: { toolbarFormat: "MMMM DD" } }}
      />
      <Typography variant="h6" sx={{ alignSelf: "center" }}>
        —
      </Typography>
      <DatePicker
        label="Záró dátum"
        value={props.endDate}
        onChange={props.onEndDateChange}
        orientation="portrait"
        slotProps={{ toolbar: { toolbarFormat: "MMMM DD" } }}
      />
    </Box>
  );
};

export default DateRangePicker;
