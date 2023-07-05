import AnimatedModal from "@/components/UI/Modal/AnimatedModal";
import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useContext, useState } from "react";
import NewGroupForm, { INewGroupFormState } from "@/components/Forms/NewGroupForm";
import { GroupContext } from "@/store/group-context";
import { SubmitHandler } from "react-hook-form";
import GroupType from "@/models/group/group-type-model";
import GroupState from "@/models/group/group-state-model";

const NewGroup: React.FC = () => {
  const groupCtx = useContext(GroupContext);
  const [modalOpened, setModalOpened] = useState(false);

  const handleModalOpen = () => {
    setModalOpened(true);
  };

  const handleModalClose = () => {
    setModalOpened(false);
  };

  const submitHandler: SubmitHandler<INewGroupFormState> = (data) => {
    //console.log(data);

    const groupType = Object.values(GroupType).find((type) => type === data.type);
    const groupState = Object.values(GroupState).find((state) => state === data.state);

    if (!groupType || !groupState) {
      return;
    }

    const newGroup = {
      id: (groupCtx.groups.length + 1).toString(),
      title: data.title,
      type: groupType,
      state: groupState,
      description: data.description,
    }
    groupCtx.addGroup(newGroup);
    setModalOpened(false);
  };

  return (
    <>
      <Button startIcon={<AddIcon />} onClick={handleModalOpen}>
        Új csoport
      </Button>
      <AnimatedModal open={modalOpened} onClose={handleModalClose}>
        <NewGroupForm onClose={handleModalClose} onSubmit={submitHandler} />
      </AnimatedModal>
    </>
  );
};

export default NewGroup;
