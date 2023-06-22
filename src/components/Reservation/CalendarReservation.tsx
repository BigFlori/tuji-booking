import { useState } from "react";
import Reservation from "@/models/reservation/reservation-model";
import dayjs from "dayjs";
import { CALENDAR_ITEM_WIDTH, CALENDAR_MONTH_GAP } from "@/config/config";
import ReservationButton from "../UI/styled/ReservationButton";
import LayoutModal from "../UI/styled/LayoutModal";
import { Box } from "@mui/material";

type CalendarReserverationProps = {
  reservation: Reservation;
};

const countMonthsBetween = (startDate: dayjs.Dayjs, endDate: dayjs.Dayjs) => {
  return endDate.get("month") - startDate.get("month");
};

const CalendarReservation: React.FC<CalendarReserverationProps> = (props: CalendarReserverationProps) => {
  const [modalOpened, setModalOpened] = useState(false);

  const closeModalHandler = () => {
    setModalOpened(false);
  };

  const openModalHandler = () => {
    setModalOpened(true);
  };

  const width =
    props.reservation.endDate.diff(props.reservation.startDate, "day") * CALENDAR_ITEM_WIDTH +
    countMonthsBetween(props.reservation.startDate, props.reservation.endDate) * CALENDAR_MONTH_GAP -
    5;

  const left =
    props.reservation.startDate.diff(dayjs(props.reservation.startDate).startOf("month"), "day") * CALENDAR_ITEM_WIDTH +
    CALENDAR_ITEM_WIDTH / 2;

  return (
    <>
      <ReservationButton sx={{ left, width }} onClick={openModalHandler}>
        {props.reservation.client?.name}
      </ReservationButton>
      <LayoutModal open={modalOpened} onClose={closeModalHandler}>
        <Box className="modal-content">as</Box>
      </LayoutModal>
    </>
  );
};

export default CalendarReservation;
