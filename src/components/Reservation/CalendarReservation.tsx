import Reservation from "@/models/reservation-model";
import { Box } from "@mui/material";
import dayjs from "dayjs";

type CalendarReserverationProps = {
  reservation: Reservation;
  renderingDate: dayjs.Dayjs;
};

const CalendarReservation: React.FC<CalendarReserverationProps> = (
  props: CalendarReserverationProps
) => {
  const isStart = props.reservation.startDate.isSame(
    props.renderingDate,
    "day"
  );
  const isEnd = props.reservation.endDate.isSame(props.renderingDate, "day");
  const width = isStart || isEnd ? "50%" : "100%";
  return <Box sx={{ height: "60%", width: width, background: "red" }}></Box>;
};

export default CalendarReservation;
