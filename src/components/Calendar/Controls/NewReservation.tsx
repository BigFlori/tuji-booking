import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useContext, useState } from "react";
import AnimatedModal from "@/components/UI/Modal/AnimatedModal";
import NewReservationForm, { INewReservationFormValues } from "@/components/Forms/NewReservationForm";
import PaymentState from "@/models/reservation/payment-state-model";
import { ClientContext } from "@/store/client-context";
import Client from "@/models/client-model";
import { ReservationContext } from "@/store/reservation-context";
import Reservation from "@/models/reservation/reservation-model";
import { v4 as uuidv4 } from "uuid";

const NewReservation: React.FC = () => {
  const clientCtx = useContext(ClientContext);
  const reservationCtx = useContext(ReservationContext);
  const [modalOpened, setModalOpened] = useState(false);

  const handleModalOpen = () => {
    setModalOpened(true);
  };

  const handleModalClose = () => {
    setModalOpened(false);
  };

  const submitHandler = (data: INewReservationFormValues) => {
    console.log(data);

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
      comment: data.comment,
    };

    reservationCtx.addReservation(newReservation);
    setModalOpened(false);
  };

  return (
    <>
      <Button startIcon={<AddIcon />} onClick={handleModalOpen}>
        Új foglalás
      </Button>
      <AnimatedModal open={modalOpened} onClose={handleModalClose}>
        <NewReservationForm onClose={handleModalClose} onSubmit={submitHandler} />
      </AnimatedModal>
    </>
  );
};

export default NewReservation;
