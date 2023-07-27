import { SubmitHandler, useForm } from "react-hook-form";
import EditGroupView from "./EditGroupView";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface IEditGroupLogicProps {
  defaultValues: IEditGroupFormModel;
  onSubmit: SubmitHandler<IEditGroupFormModel>;
  onClose: () => void;
  onDelete: () => void;
}

export interface IEditGroupFormModel {
  title: string;
  description?: string;
  state: string;
  type: string;
}

const validationSchema: yup.ObjectSchema<IEditGroupFormModel> = yup.object().shape({
  title: yup.string().max(25, "A csoport neve maximum 25 karakter lehet").required("A csoport neve kötelező"),
  description: yup.string().optional(),
  state: yup.string().required("A csoport állapota kötelező"),
  type: yup.string().required("A csoport típusa kötelező"),
});

const EditGroupLogic: React.FC<IEditGroupLogicProps> = (props) => {
  const form = useForm<IEditGroupFormModel>({
    defaultValues: props.defaultValues,
    resolver: yupResolver(validationSchema),
  });

  return <EditGroupView form={form} onSubmit={props.onSubmit} onClose={props.onClose} onDelete={props.onDelete} />;
};

export default EditGroupLogic;
