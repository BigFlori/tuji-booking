import { useState, useMemo } from "react";
import Reservation from "@/models/reservation/reservation-model";
import dayjs from "dayjs";
import { CALENDAR_ITEM_WIDTH, CALENDAR_MONTH_GAP } from "@/config/config";
import ReservationButton from "../UI/styled/ReservationButton";
import { Box } from "@mui/material";
import EditorModal from "../UI/EditorModal";
import { DatePicker } from "@mui/x-date-pickers";

type CalendarReserverationProps = {
  reservation: Reservation;
};

const countMonthsBetween = (startDate: dayjs.Dayjs, endDate: dayjs.Dayjs) => {
  return endDate.get("month") - startDate.get("month");
};

const CalendarReservation: React.FC<CalendarReserverationProps> = (props: CalendarReserverationProps) => {
  const [modalOpened, setModalOpened] = useState(false);

  const [selectedStartDate, setSelectedStartDate] = useState<dayjs.Dayjs | null>(props.reservation.startDate);
  const [selectedEndDate, setSelectedEndDate] = useState<dayjs.Dayjs | null>(props.reservation.endDate);

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

  const saveReservationHandler = () => {
    console.log("save reservation");
  };

  return (
    <>
      <ReservationButton sx={{ left, width }} onClick={openModalHandler}>
        {props.reservation.client?.name}
      </ReservationButton>
      <EditorModal
        open={modalOpened}
        onClose={closeModalHandler}
        onSave={saveReservationHandler}
        title="Foglalás szerkesztése"
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <DatePicker
            value={selectedStartDate}
            onChange={(newValue) => setSelectedStartDate(newValue)}
            label="Kezdő dátum"
            orientation="portrait"
            slotProps={{
              toolbar: {
                toolbarFormat: "MMMM DD",
              },
            }}
          />
          <DatePicker
            value={selectedEndDate}
            onChange={(newValue) => setSelectedEndDate(newValue)}
            label="Záró dátum"
            orientation="portrait"
            slotProps={{
              toolbar: {
                toolbarFormat: "MMMM DD",
              },
            }}
          />
        </Box>
      </EditorModal>
    </>
  );
};

export default CalendarReservation;
