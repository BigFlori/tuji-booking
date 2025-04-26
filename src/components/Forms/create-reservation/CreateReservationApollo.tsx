import PaymentState from "@/models/reservation/payment-state-model";
import CreateReservationLogic, { ICreateReservationFormModel } from "./CreateReservationLogic";
import { NOT_SELECTED_CLIENT_OPTION } from "../client-option/clientOptionHelper";
import { SubmitHandler } from "react-hook-form";
import Client from "@/models/client-model";
import { v4 as uuidv4 } from "uuid";
import Reservation from "@/models/reservation/reservation-model";
import { useSnack } from "@/hooks/useSnack";
import { useReservationContext } from "@/store/reservation-context";
import { useClientContext } from "@/store/client-context";

interface ICreateReservationApolloProps {
  onClose: () => void;
}

export type ICreateReservationFormModelWithEmptyDate =
  | ICreateReservationFormModel
  | {
      startDate: string;
      startTime: string;
      endDate: string;
      endTime: string;
    };

const CreateReservationApollo: React.FC<ICreateReservationApolloProps> = (props) => {
  const clientCtx = useClientContext();
  const reservationCtx = useReservationContext();
  const showSnackbar = useSnack();

  const submitHandler: SubmitHandler<ICreateReservationFormModel> = (data) => {
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

    //Új foglalás létrehozása
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
    props.onClose();
  };

  const defaultValues: ICreateReservationFormModelWithEmptyDate = {
    groupId: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
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

  return <CreateReservationLogic defaultValues={defaultValues} onSubmit={submitHandler} onClose={props.onClose} />;
};

export default CreateReservationApollo;
