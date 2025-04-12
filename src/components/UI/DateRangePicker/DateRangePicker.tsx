import { Box, Typography, useTheme } from "@mui/material";
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
  const theme = useTheme();
  
  return (
    <Box sx={{ 
      display: "flex", 
      gap: { xs: 2, md: 3 },
      flexDirection: { xs: 'column', md: 'row' },
      alignItems: "center",
      justifyContent: "center",
      width: "100%"
    }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        width: { xs: '100%', md: 'auto' }
      }}>
        <Typography 
          variant="body2" 
          sx={{ mb: 0.5, color: theme.palette.text.secondary, fontWeight: 500 }}
        >
          Kezdő dátum
        </Typography>
        <DatePicker
          value={props.startDate}
          onChange={props.onStartDateChange}
          orientation="portrait"
          sx={{ width: { xs: '100%', md: 'auto' } }}
          slotProps={{ 
            toolbar: { toolbarFormat: "YYYY. MMMM DD." },
            textField: { 
              fullWidth: true,
              placeholder: "Válassz dátumot",
            }
          }}
        />
      </Box>
      
      <Typography 
        variant="h6" 
        sx={{ 
          alignSelf: "center", 
          display: { xs: 'none', md: 'block' },
          color: theme.palette.text.secondary,
          px: 1
        }}
      >
        —
      </Typography>
      
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        width: { xs: '100%', md: 'auto' }
      }}>
        <Typography 
          variant="body2" 
          sx={{ mb: 0.5, color: theme.palette.text.secondary, fontWeight: 500 }}
        >
          Záró dátum
        </Typography>
        <DatePicker
          value={props.endDate}
          onChange={props.onEndDateChange}
          orientation="portrait"
          sx={{ width: { xs: '100%', md: 'auto' } }}
          slotProps={{ 
            toolbar: { toolbarFormat: "YYYY. MMMM DD." },
            textField: { 
              fullWidth: true,
              placeholder: "Válassz dátumot",
            }
          }}
        />
      </Box>
    </Box>
  );
};

export default DateRangePicker;