import AnimatedModal from "@/components/UI/Modal/AnimatedModal";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import CreateGroupApollo from "@/components/Forms/create-group/CreateGroupApollo";

const NewGroup: React.FC = () => {
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
        Új csoport
      </Button>
      <AnimatedModal open={modalOpened} onClose={handleModalClose}>
        <CreateGroupApollo onClose={handleModalClose} />
      </AnimatedModal>
    </>
  );
};

export default NewGroup;
