import { useMemo, useContext, useRef, useEffect } from "react";
import dayjs from "dayjs";
import Box from "@mui/material/Box";
import CalendarGroupItem from "./CalendarGroupItem";
import { GroupContext } from "@/store/group-context";
import { useIntersectionObserver } from "usehooks-ts";

type CalendarGroupProps = {
  children?: React.ReactNode;
  monthDate: dayjs.Dayjs;
  isLastGroup?: boolean;
  groupId: number;
};

//Minden hónapban renderelődik és a csoportok sorait fogja össze
const CalendarGroup: React.FC<CalendarGroupProps> = (
  props: CalendarGroupProps
) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const entry = useIntersectionObserver(ref, {});
  const isVisible = !!entry?.isIntersecting;

  const groupItems = useMemo(() => {
    const items = [];
    for (let i = 1; i <= props.monthDate.daysInMonth(); i++) {
      items.push(
        <CalendarGroupItem
          key={i}
          groupId={props.groupId}
          date={props.monthDate.date(i)}
          isLastGroup={props.isLastGroup}
          isLast={i === props.monthDate.daysInMonth()}
        />
      );
    }
    return items;
  }, [props.monthDate]);

  return <Box sx={{ display: "flex" }} ref={ref}>{isVisible && groupItems}</Box>;
};

export default CalendarGroup;
