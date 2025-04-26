import { useRef, useEffect, forwardRef } from "react";
import dayjs from "dayjs";
import Box from "@mui/material/Box";
import { SxProps, Theme, useTheme } from "@mui/material/styles";
import { CALENDAR_ITEM_WIDTH, CALENDAR_ITEM_HEIGHT } from "@/utils/config";

interface ICalendarItemContainerProps {
  children?: React.ReactNode;
  date: dayjs.Dayjs;
  isLast?: boolean;
  isLastGroup?: boolean;
  isDayRow?: boolean;
  sx?: SxProps<Theme>;
}


// Egy naptári elemet megjelenítő konténer, amely a dátum alapján dinamikusan állítja be a stílusokat és a mai naphoz görget
const CalendarItemContainer: React.FC<ICalendarItemContainerProps> = (props: ICalendarItemContainerProps) => {
  const theme = useTheme();
  const todayRef = useRef<HTMLDivElement>(null);

  const isWeekend = props.date.day() === 0 || props.date.day() === 6;
  const isToday = props.date.isSame(dayjs().format("YYYY-MM-DD"), "day");

  //Ha a mai nap van kiválasztva, akkor a háttérszín zöld lesz, különben ha hétvége akkor szürke, különben fehér
  const bgColor = isToday
    ? props.isDayRow
      ? theme.palette.isToday.dark //Mai nap színe a napok sorában
      : theme.palette.isToday.main //Mai nap színe a csoportok sorában
    : isWeekend
    ? theme.palette.isWeekend.main //Hétvége színe
    : theme.palette.isWeekday.main; //Hétköznap színe

  const color = isToday ? theme.palette.isToday.contrastText : theme.palette.isWeekend.contrastText;

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
