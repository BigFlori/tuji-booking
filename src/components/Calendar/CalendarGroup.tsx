import { useMemo, useContext, useRef, useEffect } from "react";
import dayjs from "dayjs";
import Box from "@mui/material/Box";
import { GroupContext } from "@/store/group-context";
import { useIntersectionObserver } from "usehooks-ts";
import CalendarReservation from "../Reservation/CalendarReservation";
import { ReservationContext } from "@/store/reservation-context";
import CalendarItemContainer from "../UI/CalendarItemContainer";
import { CALENDAR_ITEM_HEIGHT } from "@/config/config";

type CalendarGroupProps = {
  children?: React.ReactNode;
  monthDate: dayjs.Dayjs;
  isLastGroup?: boolean;
  groupId: number;
};

//Minden hónapban renderelődik és a csoportok sorait fogja össze
const CalendarGroup: React.FC<CalendarGroupProps> = (props: CalendarGroupProps) => {
  const reservationCtx = useContext(ReservationContext);

  const ref = useRef<HTMLDivElement | null>(null);
  const entry = useIntersectionObserver(ref, {});
  const isVisible = !!entry?.isIntersecting;

  //Az adott csoport celláit generálja
  const generateGroupItems = useMemo(() => {
    const items = [];
    for (let i = 1; i <= props.monthDate.daysInMonth(); i++) {
      items.push(
        <CalendarItemContainer
          key={i}
          date={props.monthDate.date(i)}
          isLastGroup={props.isLastGroup}
          isLast={i === props.monthDate.daysInMonth()}
        />
      );
    }
    return items;
  }, [props.monthDate]);

  const generateReservations = useMemo(() => {
    const items = [];
    for (let i = 0; i < reservationCtx.reservations.length; i++) {
      if (
        reservationCtx.reservations[i].groupId === props.groupId &&
        reservationCtx.reservations[i].startDate.isSame(props.monthDate, "month")
      ) {
        items.push(<CalendarReservation key={i} reservation={reservationCtx.reservations[i]} />);
      }
    }
    return items;
  }, [reservationCtx.reservations]);

  return (
    <Box sx={{ display: "flex", position: "relative", height: `${CALENDAR_ITEM_HEIGHT}px` }} ref={ref}>
      {generateReservations}
      {isVisible && generateGroupItems}
    </Box>
  );
};

export default CalendarGroup;
