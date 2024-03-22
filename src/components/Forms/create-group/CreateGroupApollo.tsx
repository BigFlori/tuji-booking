import GroupState from "@/models/group/group-state-model";
import CreateGroupLogic, { ICreateGroupFormModel } from "./CreateGroupLogic";
import GroupType from "@/models/group/group-type-model";
import { SubmitHandler } from "react-hook-form";
import { useContext } from "react";
import { GroupContext } from "@/store/group-context";
import { v4 as uuidv4 } from "uuid";
import { SnackbarKey, closeSnackbar, enqueueSnackbar } from "notistack";

interface ICreateGroupApolloProps {
  onClose: () => void;
}

const CreateGroupApollo: React.FC<ICreateGroupApolloProps> = (props) => {
  const groupCtx = useContext(GroupContext);

  const submitHandler: SubmitHandler<ICreateGroupFormModel> = (data) => {
    const groupType = Object.values(GroupType).find((type) => type === data.type);
    const groupState = Object.values(GroupState).find((state) => state === data.state);

    if (!groupType || !groupState) {
      return;
    }

    const newGroup = {
      id: uuidv4(),
      title: data.title,
      type: groupType,
      state: groupState,
      description: data.description,
      order: groupCtx.groups.length,
    };
    groupCtx.addGroup(newGroup);
    const key: SnackbarKey = enqueueSnackbar("Csoport létrehozva!", {
      variant: "success",
      SnackbarProps: {
        onClick: () => closeSnackbar(key),
      },
    });
    props.onClose();
  };

  const defaultValues: ICreateGroupFormModel = {
    title: "",
    description: "",
    state: GroupState.ACTIVE,
    type: GroupType.CAR,
  };

  return <CreateGroupLogic defaultValues={defaultValues} onSubmit={submitHandler} onClose={props.onClose} />;
};

export default CreateGroupApollo;
