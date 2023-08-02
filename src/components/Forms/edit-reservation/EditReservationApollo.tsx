import Reservation from "@/models/reservation/reservation-model";
import EditReservationLogic, { IEditReservationFormModel } from "./EditReservationLogic";
import dayjs from "dayjs";
import { clientToOption } from "../client-option/clientOptionHelper";
import { useContext, useMemo } from "react";
import { ClientContext } from "@/store/client-context";
import { SubmitHandler } from "react-hook-form";
import { ReservationContext } from "@/store/reservation-context";
import PaymentState from "@/models/reservation/payment-state-model";
import Client from "@/models/client-model";
import { v4 as uuidv4 } from "uuid";

interface IEditReservationApolloProps {
  onClose: () => void;
  reservation: Reservation;
}

export type IEditReservationFormModelWithEmptyDate =
  | IEditReservationFormModel
  | {
      startTime: dayjs.Dayjs | string;
      endTime: dayjs.Dayjs | string;
    };

const EditReservationApollo: React.FC<IEditReservationApolloProps> = (props) => {
  const clientCtx = useContext(ClientContext);
  const reservationCtx = useContext(ReservationContext);

  const submitHandler: SubmitHandler<IEditReservationFormModel> = (data) => {
    const paymentState = Object.values(PaymentState).find((state) => state === data.paymentState);
    if (!paymentState) return;

    if (data.selectedClientOption.clientId === "not-selected" && data.clientName) {
      //Új ügyfél létrehozása ha szükséges
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
      comment: data.comment,
    };

    reservationCtx.updateReservation(props.reservation.id, modifiedReservation);

    props.onClose();
  };

  const deleteHandler = () => {
    reservationCtx.removeReservation(props.reservation.id);
    props.onClose();
  };

  const reservationClient = useMemo(() => {
    const client = clientCtx.getClientById(props.reservation.clientId);
    return client ? client : { id: "not-selected", name: "" };
  }, [clientCtx.clients, props.reservation.clientId]);

  const defaultValues: IEditReservationFormModelWithEmptyDate = {
    groupId: props.reservation.groupId,
    startDate: dayjs(props.reservation.startDate),
    startTime: props.reservation.startTime ? dayjs(props.reservation.startTime) : "",
    endDate: dayjs(props.reservation.endDate),
    endTime: props.reservation.endTime ? dayjs(props.reservation.endTime) : "",
    paymentState: props.reservation.paymentState,
    fullPrice: props.reservation.fullPrice,
    depositPrice: props.reservation.depositPrice,
    cautionPrice: props.reservation.cautionPrice,
    cautionReturned: props.reservation.cautionReturned,
    comment: props.reservation.comment,
    selectedClientOption: clientToOption(reservationClient),
    clientName: reservationClient.name,
    clientPhone: reservationClient.phone ? reservationClient.phone : "",
    clientEmail: reservationClient.email ? reservationClient.email : "",
    clientAddress: reservationClient.address ? reservationClient.address : "",
  };

  return (
    <EditReservationLogic
      defaultValues={defaultValues}
      onSubmit={submitHandler}
      onClose={props.onClose}
      onDelete={deleteHandler}
      reservationId={props.reservation.id}
      reservationGroupId={props.reservation.groupId}
    />
  );
};

export default EditReservationApollo;
