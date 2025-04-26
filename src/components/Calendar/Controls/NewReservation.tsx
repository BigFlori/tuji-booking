import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import AnimatedModal from "@/components/UI/Modal/AnimatedModal";
import CreateReservationApollo from "@/components/Forms/create-reservation/CreateReservationApollo";

// Új foglalás létrehozó gomb, amely modális ablakot nyit az űrlappal
const NewReservation: React.FC = () => {
  const [modalOpened, setModalOpened] = useState(false);

  const handleModalOpen = () => {
    setModalOpened(true);
  };

  const handleModalClose = () => {
    setModalOpened(false);
  };

  return (
    <>
      <Button startIcon={<AddIcon />} onClick={handleModalOpen}>
        Új foglalás
      </Button>
      <AnimatedModal open={modalOpened} onClose={handleModalClose}>
        <CreateReservationApollo onClose={handleModalClose} />
      </AnimatedModal>
    </>
  );
};

export default NewReservation;
