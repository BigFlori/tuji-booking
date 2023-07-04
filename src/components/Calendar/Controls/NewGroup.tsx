import AnimatedModal from "@/components/UI/Modal/AnimatedModal";
import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";

interface INewGroupProps {}

const NewGroup: React.FC<INewGroupProps> = (props: INewGroupProps) => {
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
      <AnimatedModal open={modalOpened} onClose={handleModalClose}></AnimatedModal>
    </>
  );
};

export default NewGroup;
