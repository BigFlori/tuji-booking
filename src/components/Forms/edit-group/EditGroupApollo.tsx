import Group from "@/models/group/group-model";
import EditGroupLogic, { IEditGroupFormModel } from "./EditGroupLogic";
import { SubmitHandler } from "react-hook-form";
import { GroupContext } from "@/store/group-context";
import { useContext } from "react";
import GroupType from "@/models/group/group-type-model";
import GroupState from "@/models/group/group-state-model";
import { SnackbarKey, closeSnackbar, enqueueSnackbar } from "notistack";

interface IEditGroupApolloProps {
  onClose: () => void;
  group: Group;
}

const EditGroupApollo: React.FC<IEditGroupApolloProps> = (props) => {
  const groupCtx = useContext(GroupContext);

  const submitHandler: SubmitHandler<IEditGroupFormModel> = (data) => {
    const groupType = Object.values(GroupType).find((type) => type === data.type);
    const groupState = Object.values(GroupState).find((state) => state === data.state);

    if (!groupType || !groupState) {
      return;
    }

    const updatedGroup: Group = {
      ...props.group,
      title: data.title,
      type: groupType,
      state: groupState,
      description: data.description,
    };
    groupCtx.updateGroup(props.group.id, updatedGroup);
    const key: SnackbarKey = enqueueSnackbar("Csoport frissítve!", {
      variant: "success",
      SnackbarProps: {
        onClick: () => closeSnackbar(key),
      },
    });
    props.onClose();
  };

  const deleteHandler = () => {
    groupCtx.removeGroup(props.group.id);
    const key: SnackbarKey = enqueueSnackbar("Csoport törölve!", {
      variant: "success",
      SnackbarProps: {
        onClick: () => closeSnackbar(key),
      },
    });
    props.onClose();
  };

  const defaultValues = {
    title: props.group.title,
    description: props.group.description,
    state: props.group.state,
    type: props.group.type,
  };

  return (
    <EditGroupLogic
      defaultValues={defaultValues}
      onSubmit={submitHandler}
      onClose={props.onClose}
      onDelete={deleteHandler}
    />
  );
};

export default EditGroupApollo;
