import { GridActionsCellItem, GridRowParams } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import Client from "@/models/client-model";
import { useState } from "react";
import AnimatedModal from "../Modal/AnimatedModal";
import ClientFormApollo from "@/components/Forms/client";

interface GridActionsCellEditProps {
  params: GridRowParams<Client>;
}

// Ügyfél szerkesztésére szolgáló gomb a táblázatban
const GridActionsCellEdit = (props: GridActionsCellEditProps) => {
  const client = props.params.row;
  const [modalOpen, setModalOpen] = useState(false);

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <>
      <GridActionsCellItem
        icon={<EditIcon />}
        label="Szerkesztés"
        onClick={() => {
          setModalOpen(true);
        }}
      />

      <AnimatedModal open={modalOpen} onClose={handleModalClose}>
        <ClientFormApollo mode="edit" onClose={handleModalClose} client={client} />
      </AnimatedModal>
    </>
  );
};

export default GridActionsCellEdit;