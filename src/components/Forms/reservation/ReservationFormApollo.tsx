import Reservation from "@/models/reservation/reservation-model";
import ReservationFormLogic from "./ReservationFormLogic";
import dayjs from "dayjs";
import { clientToOption, NOT_SELECTED_CLIENT_OPTION } from "../client-option/clientOptionHelper";
import { useMemo } from "react";
import { SubmitHandler } from "react-hook-form";
import PaymentState from "@/models/reservation/payment-state-model";
import Client from "@/models/client-model";
import { v4 as uuidv4 } from "uuid";
import { useSnack } from "@/hooks/useSnack";
import { useReservationContext } from "@/store/reservation-context";
import { useClientContext } from "@/store/client-context";
import { IReservationFormApolloProps, IReservationFormModel, IReservationFormModelWithEmptyDate } from "./ReservationFormTypes";

const ReservationFormApollo: React.FC<IReservationFormApolloProps> = (props) => {
  const clientCtx = useClientContext();
  const reservationCtx = useReservationContext();
  const showSnackbar = useSnack();
  
  // Submit handler - különböző kezelés az üzemmód alapján
  const submitHandler: SubmitHandler<IReservationFormModel> = (data) => {
    const paymentState = Object.values(PaymentState).find((state) => state === data.paymentState);
    if (!paymentState) return;

    // Ügyfél kezelés - létrehozás vagy frissítés
    if (data.selectedClientOption.clientId === "not-selected" && data.clientName) {
      // Új ügyfél létrehozása, ha szükséges
      const client: Client = {
        id: uuidv4(),
        name: data.clientName,
        phone: data.clientPhone,
        email: data.clientEmail,
        address: data.clientAddress,
      };
      clientCtx.addClient(client);
      data.selectedClientOption.clientId = client.id;
    } else if (data.selectedClientOption.clientId !== "not-selected" && data.clientName) {
      // Ügyfél adatainak frissítése
      const client: Client = {
        id: data.selectedClientOption.clientId,
        name: data.clientName,
        phone: data.clientPhone,
        email: data.clientEmail,
        address: data.clientAddress,
      };
      clientCtx.updateClient(client.id, client);
    }

    if (props.mode === 'create') {
      // Új foglalás létrehozása
      const newReservation: Reservation = {
        id: uuidv4(),
        groupId: data.groupId,
        clientId: data.selectedClientOption.clientId,
        startDate: data.startDate,
        startTime: data.startTime,
        endDate: data.endDate,
        endTime: data.endTime,
        paymentState: paymentState,
        fullPrice: data.fullPrice,
        depositPrice: data.depositPrice,
        cautionPrice: data.cautionPrice,
        cautionReturned: data.cautionReturned,
        expenses: data.expenses,
        comment: data.comment,
      };

      reservationCtx.addReservation(newReservation);
      showSnackbar("Foglalás létrehozva!", "success");
    } else if (props.mode === 'edit' && props.reservation) {
      // Meglévő foglalás módosítása
      const modifiedReservation = {
        ...props.reservation,
        clientId: data.selectedClientOption.clientId,
        groupId: data.groupId,
        startDate: data.startDate,
        startTime: data.startTime,
        endDate: data.endDate,
        endTime: data.endTime,
        paymentState: paymentState,
        fullPrice: data.fullPrice,
        depositPrice: data.depositPrice,
        cautionPrice: data.cautionPrice,
        cautionReturned: data.cautionReturned,
        expenses: data.expenses,
        comment: data.comment,
      };

      reservationCtx.updateReservation(props.reservation.id, modifiedReservation);
      showSnackbar("Foglalás módosítva!", "success");
      props.onSubmit && props.onSubmit(modifiedReservation);
    }
    
    props.onClose();
  };

  // Foglalás törlése - csak Edit módban
  const deleteHandler = () => {
    if (props.mode === 'edit' && props.reservation) {
      reservationCtx.removeReservation(props.reservation.id);
      props.deleteEvent && props.deleteEvent(props.reservation.id);
      showSnackbar("Foglalás törölve!", "success");
      props.onClose();
    }
  };

  // Ügyfél adatainak lekérése - csak Edit módban
  const reservationClient = useMemo(() => {
    if (props.mode === 'edit' && props.reservation) {
      const client = clientCtx.getClientById(props.reservation.clientId);
      return client ? client : { id: "not-selected", name: "" };
    }
    return { id: "not-selected", name: "" };
  }, [clientCtx.clients, props.reservation, props.mode]);

  // Default értékek összeállítása
  let defaultValues: IReservationFormModelWithEmptyDate;

  if (props.mode === 'create') {
    // Új foglalás alapértékei
    defaultValues = {
      groupId: "",
      startDate: "",
      startTime: undefined,
      endDate: "",
      endTime: undefined,
      paymentState: PaymentState.NOT_PAID,
      fullPrice: 0,
      depositPrice: 0,
      cautionPrice: 0,
      cautionReturned: false,
      expenses: 0,
      comment: "",
      selectedClientOption: NOT_SELECTED_CLIENT_OPTION,
      clientName: "",
      clientPhone: "",
      clientEmail: "",
      clientAddress: "",
    };
  } else {
    // Meglévő foglalás alapértékei (Edit mód)
    if (!props.reservation) {
      throw new Error("Reservation is required in edit mode");
    }
    
    defaultValues = {
      groupId: props.reservation.groupId,
      startDate: dayjs(props.reservation.startDate),
      startTime: props.reservation.startTime ? dayjs(props.reservation.startTime) : undefined,
      endDate: dayjs(props.reservation.endDate),
      endTime: props.reservation.endTime ? dayjs(props.reservation.endTime) : undefined,
      paymentState: props.reservation.paymentState,
      fullPrice: props.reservation.fullPrice,
      depositPrice: props.reservation.depositPrice,
      cautionPrice: props.reservation.cautionPrice,
      cautionReturned: props.reservation.cautionReturned,
      expenses: props.reservation.expenses,
      comment: props.reservation.comment,
      selectedClientOption: clientToOption(reservationClient),
      clientName: reservationClient.name,
      clientPhone: reservationClient.phone ? reservationClient.phone : "",
      clientEmail: reservationClient.email ? reservationClient.email : "",
      clientAddress: reservationClient.address ? reservationClient.address : "",
    };
  }

  return (
    <ReservationFormLogic
      mode={props.mode}
      defaultValues={defaultValues}
      onSubmit={submitHandler}
      onClose={props.onClose}
      onDelete={props.mode === 'edit' ? deleteHandler : undefined}
      reservation={props.reservation}
      disableDateChange={props.disableDateChange}
      disableGroupChange={props.disableGroupChange}
    />
  );
};

export default ReservationFormApollo;