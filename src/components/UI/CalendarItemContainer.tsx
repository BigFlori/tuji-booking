import dayjs from "dayjs";
import Box from "@mui/material/Box";
import { SxProps, Theme } from "@mui/material/styles";
// import useTheme from "@mui/material/styles/useTheme";

type CalendarItemContainerProps = {
  children?: React.ReactNode;
  date: dayjs.Dayjs;
  isLast?: boolean;
  isLastGroup?: boolean;
  isDayRow?: boolean;
  sx?: SxProps<Theme>;
};

const CalendarItemContainer: React.FC<CalendarItemContainerProps> = (
  props: CalendarItemContainerProps
) => {
  // const theme = useTheme();

  const isWeekend = props.date.day() === 0 || props.date.day() === 6;
  const isToday = props.date.isSame(dayjs(), "day");

  const bgColor =
    isToday && !props.isDayRow
      ? "green"
      : isWeekend
      ? "grey.300"
      : "transparent";
  const color = isToday ? "green" : "black";

  return (
    <Box
      sx={{
        color,
        border: "1px solid #eee",
        borderRight: props.isLast ? "1px solid #eee" : "none",
        borderBottom: props.isLastGroup ? "1px solid #eee" : "none",
        minWidth: "60px",
        height: "55px",
        backgroundColor: bgColor,
        ...props.sx,
      }}
      id={`${isToday ? "today" : ""}`}
    >
      {props.children}
    </Box>
  );
};

export default CalendarItemContainer;
