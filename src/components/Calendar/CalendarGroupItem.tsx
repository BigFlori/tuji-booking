import { useContext } from "react";
import dayjs from "dayjs";
import CalendarItemContainer from "../UI/CalendarItemContainer";
import { GroupContext } from "@/store/group-context";
import { ReservationContext } from "@/store/reservation-context";
import CalendarReservation from "../Reservation/CalendarReservation";

type CalendarGroupProps = {
  date: dayjs.Dayjs;
  isLast?: boolean;
  isLastGroup?: boolean;
  groupId: number;
};

//Minden nap renderelődik és a csoportok sorainak egyes celláit jeleníti meg
const CalendarGroupItem: React.FC<CalendarGroupProps> = (
  props: CalendarGroupProps
) => {
  const groupCtx = useContext(GroupContext);
  const reservationCtx = useContext(ReservationContext);
  const reservation = reservationCtx.findReservationByDate(
    props.date,
    props.groupId
  );

  return (
    <CalendarItemContainer
      date={props.date}
      isLast={props.isLast}
      isLastGroup={props.isLastGroup}
    >
      {reservation && (
        <CalendarReservation
          reservation={reservation}
          renderingDate={props.date}
        />
      )}
    </CalendarItemContainer>
  );
};

export default CalendarGroupItem;
