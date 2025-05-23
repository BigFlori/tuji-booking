import { useState, useMemo } from "react";
import Reservation from "@/models/reservation/reservation-model";
import dayjs from "dayjs";
import { CALENDAR_ITEM_WIDTH, CALENDAR_MONTH_GAP } from "@/utils/config";
import ReservationButton from "../UI/styled/ReservationButton";
import { useClientContext } from "@/store/client-context";
import AnimatedModal from "../UI/Modal/AnimatedModal";
import { darken } from "@mui/material";
import { usePaymentStateColor } from "@/hooks/usePaymentStateColor";
import ReservationFormApollo from "../Forms/reservation";

interface ICalendarReserverationProps {
  reservation: Reservation;
  isOverflowing?: boolean;
  viewYear: number;
}

const countMonthsBetween = (startDate: dayjs.Dayjs, endDate: dayjs.Dayjs) => {
  return endDate.get("month") - startDate.get("month");
};

//Minnél nagyobb a szám annál kevesebb karakternél formázza le a nevet
const CUT_THRESHOLD = 9;

const formatName = (name: string, reservedDays: number) => {
  if (name.length < (reservedDays * CALENDAR_ITEM_WIDTH) / CUT_THRESHOLD) return name;

  const nameParts = name.split(" ");
  //Ha csak egy szótagú a név akkor az első betűt adja vissza
  if (nameParts.length === 1) {
    return nameParts[0].charAt(0) + ".";
  }

  //Ha két szótagú a név
  if (nameParts.length === 2) {
    const shortestNamePart = nameParts.reduce((prev, current) => {
      return prev.length < current.length ? prev : current;
    });
    let shortedName = "";
    nameParts.forEach((namePart, index) => {
      if (namePart === shortestNamePart) {
        //Ha csak 1 napos a foglalás, és a rövidebb név is hosszabb mint 6 karakter, akkor csak az első betűt adja vissza
        if (reservedDays === 1 && shortestNamePart.length > 6) {
          shortedName += namePart.charAt(0) + ".";
          return;
        }
        //Ha több napos a foglalás, és a rövidebb név is hosszabb mint 9 karakter, akkor csak az első betűt adja vissza
        if (reservedDays < 3 && shortestNamePart.length > 9) {
          shortedName += namePart.charAt(0) + ".";
          return;
        }
        //Szélsőséges esetben, ha a rövidebb név is hosszabb mint 14 karakter, akkor csak az első betűt adja vissza
        if (shortestNamePart.length > 14) {
          shortedName += namePart.charAt(0) + ".";
          return;
        }
        //Egyéb esetben a teljes nevet adja vissza
        shortedName += namePart;
        if (index === 0) shortedName += " ";
        return;
      }
      shortedName += namePart.charAt(0) + ".";
      if (index === 0) shortedName += " ";
    });
    return shortedName;
  }

  //Ha kettőnél több szótagú a név akkor az első és az utolsó betűt adja vissza
  if (nameParts.length > 2) {
    let shortedName = "";
    shortedName += nameParts[0].charAt(0) + ". ";
    shortedName += nameParts[1].charAt(0) + ". ";
    shortedName += nameParts[nameParts.length - 1].charAt(0) + ". ";
    return shortedName;
  }
};

const CalendarReservation: React.FC<ICalendarReserverationProps> = (props: ICalendarReserverationProps) => {
  const clientCtx = useClientContext();

  //Ha van hozzárendelt ügyfél, akkor azt adja vissza, ha nincs, akkor egy új ügyfelet ami amolyan placeholderként szolgál
  const reservationClient = useMemo(() => {
    const client = clientCtx.getClientById(props.reservation.clientId);
    return client ? client : { id: "", name: "" };
  }, [clientCtx.clients, props.reservation.clientId]);

  const [modalOpened, setModalOpened] = useState(false);

  const daysReserved = props.reservation.endDate.diff(props.reservation.startDate, "day");

  const width =
    daysReserved * CALENDAR_ITEM_WIDTH +
    countMonthsBetween(props.reservation.startDate, props.reservation.endDate) * CALENDAR_MONTH_GAP +
    5;

  const differentYearEnding = props.reservation.startDate.get("year") < props.reservation.endDate.get("year");

  //Decemberi foglalásoknál a szélesség kiszámítása amik átérnek az új évbe
  const widthWithYearEnding =
    (31 - props.reservation.startDate.get("date")) * CALENDAR_ITEM_WIDTH + CALENDAR_ITEM_WIDTH - 8;

  //Decemberből érkező átlógó foglalásoknál a szélesség kiszámítása
  const overflowWidth =
    (props.reservation.endDate.diff(dayjs(`${props.reservation.endDate.get("year")}-01-01`), "day") + 1) *
      CALENDAR_ITEM_WIDTH -
    CALENDAR_ITEM_WIDTH / 2 -
    8 +
    countMonthsBetween(dayjs(`${props.reservation.endDate.get("year")}-01-01`), props.reservation.endDate) *
      CALENDAR_MONTH_GAP;

  const left =
    props.reservation.startDate.diff(dayjs(props.reservation.startDate).startOf("month"), "day") * CALENDAR_ITEM_WIDTH +
    CALENDAR_ITEM_WIDTH / 2 -
    2;

  const handleModalClose = () => {
    setModalOpened(false);
  };

  const handleModalOpen = () => {
    setModalOpened(true);
  };

  const renderOverflowedYear = props.isOverflowing && props.viewYear !== props.reservation.endDate.get("year");

  const paymentStateColor = usePaymentStateColor(props.reservation.paymentState);
  const paymentStateColorHover = darken(usePaymentStateColor(props.reservation.paymentState), 0.08);
  
  return (
    <>
      <ReservationButton
        sx={() => ({
          left: !differentYearEnding ? left : !renderOverflowedYear ? 4 : left - 16,
          width: !differentYearEnding ? width : !renderOverflowedYear ? overflowWidth : widthWithYearEnding,
          background: paymentStateColor,
          "&:hover": {
            background: paymentStateColorHover,
          },
          fontSize:
            daysReserved === 1 ||
            props.reservation.startDate.get("date") === 31 ||
            props.reservation.endDate.get("date") === 1
              ? "0.7em"
              : "0.85em",
          clipPath: !differentYearEnding
            ? `polygon(${width - 10}px 0, 100% 50%, ${width - 10}px 100%, 0% 100%, 10px 50%, 0% 0%)`
            : null,
        })}
        onClick={handleModalOpen}
      >
        {formatName(
          reservationClient.name,
          props.reservation.startDate.get("date") === 31 || props.reservation.endDate.get("date") === 1
            ? 1
            : daysReserved
        )}
      </ReservationButton>
      <AnimatedModal open={modalOpened} onClose={handleModalClose}>
        <ReservationFormApollo
          mode="edit"
          onClose={handleModalClose}
          reservation={props.reservation}
        />
      </AnimatedModal>
    </>
  );
};

export default CalendarReservation;
