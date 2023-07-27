import { SubmitHandler, useForm } from "react-hook-form";
import CreateGroupView from "./CreateGroupView";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface ICreateGroupLogicProps {
  defaultValues: ICreateGroupFormModel;
  onSubmit: SubmitHandler<ICreateGroupFormModel>;
  onClose: () => void;
}

export interface ICreateGroupFormModel {
  title: string;
  description?: string;
  state: string;
  type: string;
}

const validationSchema: yup.ObjectSchema<ICreateGroupFormModel> = yup.object().shape({
  title: yup.string().max(25, "A csoport neve maximum 25 karakter lehet").required("A csoport neve kötelező"),
  description: yup.string().optional(),
  state: yup.string().required("A csoport állapota kötelező"),
  type: yup.string().required("A csoport típusa kötelező"),
});

const CreateGroupLogic: React.FC<ICreateGroupLogicProps> = (props) => {
  const form = useForm<ICreateGroupFormModel>({
    defaultValues: props.defaultValues,
    resolver: yupResolver(validationSchema),
  });

  return <CreateGroupView form={form} onSubmit={props.onSubmit} onClose={props.onClose} />;
};

export default CreateGroupLogic;
