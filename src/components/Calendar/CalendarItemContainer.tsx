import { useRef, useEffect, forwardRef } from "react";
import dayjs from "dayjs";
import Box from "@mui/material/Box";
import { SxProps, Theme } from "@mui/material/styles";
import { CALENDAR_ITEM_WIDTH, CALENDAR_ITEM_HEIGHT } from "@/config/config";

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
  const todayRef = useRef<HTMLDivElement>(null);

  const isWeekend = props.date.day() === 0 || props.date.day() === 6;
  const isToday = props.date.isSame(dayjs().format('YYYY-MM-DD'), "day");

  const bgColor =
    isToday && !props.isDayRow
      ? "#81c784"
      : isWeekend
      ? "grey.300"
      : "transparent";
  const color = isToday ? "green" : "black";

  useEffect(() => {
    if (isToday && props.isDayRow) {
      todayRef.current?.scrollIntoView({
        block: "center",
        inline: "center",
      });
    }
  }, []);

  return (
    <Box
      sx={{
        color,
        border: "1px solid #eee",
        borderRight: props.isLast ? "1px solid #eee" : "none",
        borderBottom: props.isLastGroup ? "1px solid #eee" : "none",
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
