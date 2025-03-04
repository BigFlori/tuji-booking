import { GridActionsCellItem, GridRowParams } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import Client from "@/models/client-model";
import { useClientContext } from "@/store/client-context";
import { useState } from "react";
import AnimatedModal from "../Modal/AnimatedModal";
import EditClientApollo from "@/components/Forms/edit-client/EditClientApollo";

interface GridActionsCellEditProps {
  params: GridRowParams<Client>;
}

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
        <EditClientApollo onClose={handleModalClose} client={client} />
      </AnimatedModal>
    </>
  );
};

export default GridActionsCellEdit;
