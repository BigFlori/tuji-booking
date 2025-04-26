import { SubmitHandler, useForm } from "react-hook-form";
import GroupFormView from "./GroupFormView";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { IGroupFormLogicProps, IGroupFormModel } from "./GroupFormTypes";

const GroupFormLogic: React.FC<IGroupFormLogicProps> = (props) => {
  // Validációs séma - mindkét mód ugyanazt használja
  const validationSchema: yup.ObjectSchema<IGroupFormModel> = yup.object().shape({
    title: yup.string().max(25, "A csoport neve maximum 25 karakter lehet").required("A csoport neve kötelező"),
    description: yup.string().optional(),
    state: yup.string().required("A csoport állapota kötelező"),
    type: yup.string().required("A csoport típusa kötelező"),
  });

  const form = useForm<IGroupFormModel>({
    defaultValues: props.defaultValues,
    resolver: yupResolver(validationSchema),
  });

  return (
    <GroupFormView
      mode={props.mode}
      form={form}
      onSubmit={props.onSubmit}
      onClose={props.onClose}
      onDelete={props.onDelete}
    />
  );
};

export default GroupFormLogic;