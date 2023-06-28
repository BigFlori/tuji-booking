import { useState, useMemo, useContext } from "react";
import Reservation from "@/models/reservation/reservation-model";
import dayjs from "dayjs";
import { CALENDAR_ITEM_WIDTH, CALENDAR_MONTH_GAP } from "@/config/config";
import ReservationButton from "../UI/styled/ReservationButton";
import { ClientContext } from "@/store/client-context";
import { ReservationContext } from "@/store/reservation-context";
import Client from "@/models/client-model";
import PaymentState from "@/models/reservation/payment-state-model";
import ReservationEditForm, { ReservationEditFormValues } from "../Forms/ReservationEditForm";
import AnimatedModal from "../UI/Modal/AnimatedModal";
import { SubmitHandler } from "react-hook-form";
import { Theme, darken } from "@mui/material";

type CalendarReserverationProps = {
  reservation: Reservation;
};

const countMonthsBetween = (startDate: dayjs.Dayjs, endDate: dayjs.Dayjs) => {
  return endDate.get("month") - startDate.get("month");
};

const CalendarReservation: React.FC<CalendarReserverationProps> = (props: CalendarReserverationProps) => {
  const clientCtx = useContext(ClientContext);
  const reservationCtx = useContext(ReservationContext);

  //Ha van hozzárendelt ügyfél, akkor azt adja vissza, ha nincs, akkor egy új ügyfelet ami amolyan placeholderként szolgál
  const reservationClient = useMemo(() => {
    const client = clientCtx.getClientById(props.reservation.clientId);
    return client ? client : { id: "", name: "" };
  }, [clientCtx.clients, props.reservation.clientId]);

  const [modalOpened, setModalOpened] = useState(false);

  const width =
    props.reservation.endDate.diff(props.reservation.startDate, "day") * CALENDAR_ITEM_WIDTH +
    countMonthsBetween(props.reservation.startDate, props.reservation.endDate) * CALENDAR_MONTH_GAP -
    5;

  const left =
    props.reservation.startDate.diff(dayjs(props.reservation.startDate).startOf("month"), "day") * CALENDAR_ITEM_WIDTH +
    CALENDAR_ITEM_WIDTH / 2;

  const handleModalClose = () => {
    setModalOpened(false);
  };
  /*
  const saveReservationHandler = () => {
    if (!selectedStartDate || !selectedEndDate) return;

    const paymentState: PaymentState | undefined = Object.values(PaymentState).find(
      (state) => state === selectedPaymentState
    );

    if (!paymentState) return;

    const reservation: Reservation = {
      ...props.reservation,
      startDate: selectedStartDate,
      endDate: selectedEndDate,
      paymentState: paymentState,
      fullPrice: Number(fullPrice),
      depositPrice: Number(depositPrice),
      comment: comment,
      clientId: clientState.id,
    };
    console.log(`${clientState.id} ${clientState.name}`);

    if (clientState.id === "new" && clientState.name) {
      //Új ügyfél létrehozása
      const client: Client = {
        id: (clientCtx.clients.length + 1).toString(),
        name: clientState.name,
        phone: clientState.phone,
        email: clientState.email,
        address: clientState.address,
      };
      clientCtx.addClient(client);
      reservation.clientId = client.id;
    } else {
      //Ügyfél adatainak frissítése
      const client: Client = {
        id: clientState.id,
        name: clientState.name,
        phone: clientState.phone,
        email: clientState.email,
        address: clientState.address,
      };
      clientCtx.updateClient(client.id, client);
    }
    setSelectedClientOption({ id: clientState.id, label: clientState.name });
    reservationCtx.updateReservation(props.reservation.id, reservation);

    setModalOpened(false);
  };*/

  const submintHandler: SubmitHandler<ReservationEditFormValues> = (data) => {
    console.log("saveHandler");
    console.log(data);

    const paymentState = Object.values(PaymentState).find((state) => state === data.paymentState);
    if (!paymentState) return;

    if (data.selectedClientOption.clientId === "not-selected" && data.clientName) {
      //Új ügyfél létrehozása ha szükséges
      const client: Client = {
        id: (clientCtx.clients.length + 1).toString(),
        name: data.clientName,
        phone: data.clientPhone,
        email: data.clientEmail,
        address: data.clientAddress,
      };
      clientCtx.addClient(client);
      data.selectedClientOption.clientId = client.id;
    } else if (data.selectedClientOption.clientId !== "not-selected") {
      //Ügyfél adatainak frissítése
      const client: Client = {
        id: data.selectedClientOption.clientId,
        name: data.clientName,
        phone: data.clientPhone,
        email: data.clientEmail,
        address: data.clientAddress,
      };
      clientCtx.updateClient(client.id, client);
    }

    //Módosított foglalás létrehozása
    const modifiedReservation = {
      ...props.reservation,
      ...data,
      clientId: data.selectedClientOption.clientId,
      paymentState: paymentState,
    };

    reservationCtx.updateReservation(props.reservation.id, modifiedReservation);

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
        })}
        onClick={() => setModalOpened(true)}
      >
        {reservationClient.name}
      </ReservationButton>
      <AnimatedModal open={modalOpened} onClose={handleModalClose}>
        <ReservationEditForm
          reservation={props.reservation}
          client={reservationClient}
          onSubmit={submintHandler}
          onClose={handleModalClose}
        />
      </AnimatedModal>
    </>
  );
};

export default CalendarReservation;
