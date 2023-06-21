import Reservation from "@/models/reservation-model";
import { Box } from "@mui/material";
import dayjs from "dayjs";
import { CALENDAR_ITEM_WIDTH, CALENDAR_MONTH_GAP } from "@/config/config";

type CalendarReserverationProps = {
  reservation: Reservation;
};

const countMonthsBetween = (startDate: dayjs.Dayjs, endDate: dayjs.Dayjs) => {
  //console.log(`${endDate.get("month")} - ${startDate.get("month")} = ${endDate.get("month") - startDate.get("month")}`);
  return endDate.get("month") - startDate.get("month");
};

const CalendarReservation: React.FC<CalendarReserverationProps> = (props: CalendarReserverationProps) => {
  const width =
    props.reservation.endDate.diff(props.reservation.startDate, "day") * CALENDAR_ITEM_WIDTH +
    countMonthsBetween(props.reservation.startDate, props.reservation.endDate) * CALENDAR_MONTH_GAP - 5;

  const left =
    props.reservation.startDate.diff(dayjs(props.reservation.startDate).startOf("month"), "day") * CALENDAR_ITEM_WIDTH +
    CALENDAR_ITEM_WIDTH / 2;

  return (
    <Box
      sx={(theme) => ({
        position: "absolute",
        height: "60%",
        top: "50%",
        transform: "translateY(-50%)",
        left: left,
        width: width,
        zIndex: 5,
        background: theme.palette.error.light,
        borderRadius: 1,
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        paddingLeft: 1,
        fontWeight: 'bold',
      })}
    >
      {props.reservation.client?.name}
    </Box>
  );
};

export default CalendarReservation;
