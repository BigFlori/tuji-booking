import { useRef, useEffect, forwardRef } from "react";
import dayjs from "dayjs";
import Box from "@mui/material/Box";
import { SxProps, Theme, useTheme } from "@mui/material/styles";
import { CALENDAR_ITEM_WIDTH, CALENDAR_ITEM_HEIGHT } from "@/config/config";
import { grey } from "@mui/material/colors";

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
  const theme = useTheme();
  const todayRef = useRef<HTMLDivElement>(null);

  const isWeekend = props.date.day() === 0 || props.date.day() === 6;
  const isToday = props.date.isSame(dayjs().format('YYYY-MM-DD'), "day");

  //Ha a mai nap van kiválasztva, akkor a háttérszín zöld lesz, különben ha hétvége akkor szürke, különben átlátszó
  const bgColor =
    isToday && !props.isDayRow
      ? theme.palette.isToday.main
      : isWeekend
      ? theme.palette.isWeekend.main
      : theme.palette.isWeekday.main;

  const color = isToday ? theme.palette.isTodayText.main : theme.palette.isToday.contrastText;

  //Első rendereléskor a mai naphoz görget
  useEffect(() => {
    if (isToday && props.isDayRow) {
      todayRef.current?.scrollIntoView({
        block: "start",
        inline: "start",
      });
    }
  }, []);

  return (
    <Box
      sx={{
        color,
        border: `1px solid ${theme.palette.calendarBorder.main}`,
        borderRight: props.isLast ? `1px solid ${theme.palette.calendarBorder.main}` : "none",
        borderBottom: props.isLastGroup ? `1px solid ${theme.palette.calendarBorder.main}` : "none",
        minWidth: CALENDAR_ITEM_WIDTH,
        height: CALENDAR_ITEM_HEIGHT,
        backgroundColor: bgColor,
        ...props.sx,
      }}
      ref={isToday ? todayRef : null}
      id={isToday ? "today" : ""}
    >
      {props.children}
    </Box>
  );
};

export default CalendarItemContainer;
