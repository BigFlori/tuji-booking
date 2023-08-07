import { useState, useMemo, useContext } from "react";
import Reservation from "@/models/reservation/reservation-model";
import dayjs from "dayjs";
import { CALENDAR_ITEM_WIDTH, CALENDAR_MONTH_GAP } from "@/config/config";
import ReservationButton from "../UI/styled/ReservationButton";
import { ClientContext } from "@/store/client-context";
import PaymentState from "@/models/reservation/payment-state-model";
import AnimatedModal from "../UI/Modal/AnimatedModal";
import { Theme, darken } from "@mui/material";
import EditReservationApollo from "../Forms/edit-reservation/EditReservationApollo";

interface ICalendarReserverationProps {
  reservation: Reservation;
}

const countMonthsBetween = (startDate: dayjs.Dayjs, endDate: dayjs.Dayjs) => {
  return endDate.get("month") - startDate.get("month");
};

//Minnél nagyobb a szám annál kevesebb karakternél formázza le a nevet
const CUT_THRESHOLD = 9;

const formatName = (name: string, reservedDays: number) => {
  if (name.length < (reservedDays * CALENDAR_ITEM_WIDTH) / CUT_THRESHOLD) return name;

  const nameParts = name.split(" ");
  if (nameParts.length === 1) {
    return nameParts[0].charAt(0) + ".";
  }

  if (nameParts.length === 2) {
    const shortestNamePart = nameParts.reduce((prev, current) => {
      return prev.length < current.length ? prev : current;
    });
    let shortedName = "";
    nameParts.forEach((namePart) => {
      shortedName += namePart === shortestNamePart ? shortestNamePart + " " : namePart.charAt(0) + ". ";
    });
    return shortedName;
  }

  if (nameParts.length > 2) {
    let shortedName = "";
    nameParts.forEach((namePart) => {
      shortedName += namePart.charAt(0) + ".";
    });
    return shortedName;
  }
};

const CalendarReservation: React.FC<ICalendarReserverationProps> = (props: ICalendarReserverationProps) => {
  const clientCtx = useContext(ClientContext);

  //Ha van hozzárendelt ügyfél, akkor azt adja vissza, ha nincs, akkor egy új ügyfelet ami amolyan placeholderként szolgál
  const reservationClient = useMemo(() => {
    const client = clientCtx.getClientById(props.reservation.clientId);
    return client ? client : { id: "", name: "" };
  }, [clientCtx.clients, props.reservation.clientId]);

  const [modalOpened, setModalOpened] = useState(false);

  const daysReserved = props.reservation.endDate.diff(props.reservation.startDate, "day");

  const width =
    daysReserved * CALENDAR_ITEM_WIDTH +
    countMonthsBetween(props.reservation.startDate, props.reservation.endDate) * CALENDAR_MONTH_GAP + 6;

  const left =
    props.reservation.startDate.diff(dayjs(props.reservation.startDate).startOf("month"), "day") * CALENDAR_ITEM_WIDTH +
    CALENDAR_ITEM_WIDTH / 2 - 2;

  const handleModalClose = () => {
    setModalOpened(false);
  };

  const getBgColor = (theme: Theme) => {
    switch (props.reservation.paymentState) {
      case PaymentState.NOT_PAID:
        return theme.palette.notPaid.main;
      case PaymentState.DEPOSIT_PAID:
        return theme.palette.depositPaid.main;
      case PaymentState.FULL_PAID:
        return theme.palette.fullPaid.main;
      case PaymentState.CANCELLED:
        return theme.palette.cancelled.main;
      case PaymentState.BLOCKED:
        return theme.palette.blocked.main;
      default:
        return theme.palette.notPaid.main;
    }
  };

  return (
    <>
      <ReservationButton
        sx={(theme) => ({
          left,
          width,
          background: getBgColor(theme),
          "&:hover": {
            background: darken(getBgColor(theme), 0.08),
          },
          fontSize: daysReserved === 1 ? "0.7em" : "0.85em",
          clipPath: `polygon(${width - 15}px 0, 100% 50%, ${width - 15}px 100%, 0% 100%, 15px 50%, 0% 0%)`
        })}
        onClick={() => setModalOpened(true)}
      >
        {formatName(reservationClient.name, daysReserved)}
      </ReservationButton>
      <AnimatedModal open={modalOpened} onClose={handleModalClose}>
        <EditReservationApollo onClose={handleModalClose} reservation={props.reservation} />
      </AnimatedModal>
    </>
  );
};

export default CalendarReservation;
