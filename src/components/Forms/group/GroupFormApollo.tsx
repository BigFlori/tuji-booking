import Group from "@/models/group/group-model";
import GroupFormLogic from "./GroupFormLogic";
import { SubmitHandler } from "react-hook-form";
import GroupType from "@/models/group/group-type-model";
import GroupState from "@/models/group/group-state-model";
import { useSnack } from "@/hooks/useSnack";
import { useGroupContext } from "@/store/group-context";
import { IGroupFormApolloProps, IGroupFormModel } from "./GroupFormTypes";
import { v4 as uuidv4 } from "uuid";

const GroupFormApollo: React.FC<IGroupFormApolloProps> = (props) => {
  const groupCtx = useGroupContext();
  const showSnackbar = useSnack();

  const submitHandler: SubmitHandler<IGroupFormModel> = (data) => {
    const groupType = Object.values(GroupType).find((type) => type === data.type);
    const groupState = Object.values(GroupState).find((state) => state === data.state);

    if (!groupType || !groupState) {
      return;
    }

    if (props.mode === 'create') {
      // Új csoport létrehozása
      const newGroup = {
        id: uuidv4(),
        title: data.title,
        type: groupType,
        state: groupState,
        description: data.description,
        order: groupCtx.groups.length,
      };
      groupCtx.addGroup(newGroup);
      showSnackbar("Csoport létrehozva!", "success");
      props.onSubmit && props.onSubmit(newGroup);
    } else if (props.mode === 'edit' && props.group) {
      // Meglévő csoport módosítása
      const updatedGroup: Group = {
        ...props.group,
        title: data.title,
        type: groupType,
        state: groupState,
        description: data.description,
      };
      groupCtx.updateGroup(props.group.id, updatedGroup);
      showSnackbar("Csoport frissítve!", "success");
      props.onSubmit && props.onSubmit(updatedGroup);
    }
    
    props.onClose();
  };

  // Csoport törlés - csak Edit módban
  const deleteHandler = () => {
    if (props.mode === 'edit' && props.group) {
      groupCtx.removeGroup(props.group.id);
      showSnackbar("Csoport törölve!", "success");
      props.onClose();
    }
  };

  // Default értékek összeállítása a form mód alapján
  let defaultValues: IGroupFormModel;

  if (props.mode === 'create') {
    defaultValues = {
      title: "",
      description: "",
      state: GroupState.ACTIVE,
      type: GroupType.CAR,
    };
  } else {
    // Edit mód esetén az aktuális csoport adataival töltjük fel
    if (!props.group) {
      throw new Error("Group is required in edit mode");
    }
    
    defaultValues = {
      title: props.group.title,
      description: props.group.description,
      state: props.group.state,
      type: props.group.type,
    };
  }

  return (
    <GroupFormLogic
      mode={props.mode}
      defaultValues={defaultValues}
      onSubmit={submitHandler}
      onClose={props.onClose}
      onDelete={props.mode === 'edit' ? deleteHandler : undefined}
    />
  );
};

export default GroupFormApollo;