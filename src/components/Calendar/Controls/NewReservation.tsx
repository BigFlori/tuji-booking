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

interface INewReservationProps {}

const NewReservation: React.FC<INewReservationProps> = (props: INewReservationProps) => {
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
        id: (clientCtx.clients.length + 1).toString(),
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
      id: (reservationCtx.reservations.length + 1).toString(),
      ...data,
      clientId: data.selectedClientOption.clientId,
      paymentState: paymentState,
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
