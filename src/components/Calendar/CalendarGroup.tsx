import { useMemo } from "react";
import dayjs from "dayjs";
import Box from "@mui/material/Box";
import CalendarGroupItem from "./CalendarGroupItem";

type CalendarGroupProps = {
  children?: React.ReactNode;
  monthDate: dayjs.Dayjs;
  isLastGroup?: boolean;
};

const CalendarGroup: React.FC<CalendarGroupProps> = (
  props: CalendarGroupProps
) => {
  const groupItems = useMemo(() => {
    const items = [];
    for (let i = 1; i <= props.monthDate.daysInMonth(); i++) {
      items.push(<CalendarGroupItem key={i} date={props.monthDate.date(i)} isLastGroup={props.isLastGroup} isLast={i === props.monthDate.daysInMonth()} />);
    }
    return items;
  }, [props.monthDate]);

  return <Box sx={{ display: "flex" }}>{groupItems}</Box>;
};

export default CalendarGroup;
