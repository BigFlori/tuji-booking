import Group from "@/models/group/group-model";
import EditGroupLogic, { IEditGroupFormModel } from "./EditGroupLogic";
import { SubmitHandler } from "react-hook-form";
import { GroupContext } from "@/store/group-context";
import { useContext } from "react";
import GroupType from "@/models/group/group-type-model";
import GroupState from "@/models/group/group-state-model";
import { useSnack } from "@/hooks/useSnack";

interface IEditGroupApolloProps {
  onClose: () => void;
  group: Group;
}

const EditGroupApollo: React.FC<IEditGroupApolloProps> = (props) => {
  const groupCtx = useContext(GroupContext);
  const showSnackbar = useSnack();

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
    showSnackbar("Csoport frissítve!", "success");
    props.onClose();
  };

  const deleteHandler = () => {
    groupCtx.removeGroup(props.group.id);
    showSnackbar("Csoport törölve!", "success");
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
