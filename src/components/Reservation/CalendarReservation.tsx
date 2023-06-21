import Reservation from "@/models/reservation-model";
import { Box } from "@mui/material";
import dayjs from "dayjs";

type CalendarReserverationProps = {
  reservation: Reservation;
};

const CalendarReservation: React.FC<CalendarReserverationProps> = (
  props: CalendarReserverationProps
) => {
  
  const width = props.reservation.endDate.diff(props.reservation.startDate, "day") * 65;
  const left = props.reservation.startDate.diff(dayjs(props.reservation.startDate).startOf("month"), "day") * 65;

  return <Box sx={{ position: "absolute", height: "60%", left: left, width: width, background: "red" }}>{props.reservation.id}</Box>;
};

export default CalendarReservation;
