import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import EditClientView from "./EditClientView";

interface IEditClientLogicProps {
  defaultValues: IEditClientFormModel;
  onSubmit: SubmitHandler<IEditClientFormModel>;
  onClose: () => void;
  onDelete: () => void;
  clientId: string;
}

export interface IEditClientFormModel {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
}

const EditClientLogic: React.FC<IEditClientLogicProps> = (props) => {
  const validationSchema: yup.ObjectSchema<IEditClientFormModel> = yup.object().shape({
    name: yup.string().required("Név megadása kötelező"),
    phone: yup.string().optional(),
    email: yup.string().email("Érvénytelen email cím").optional(),
    address: yup.string().optional(),
  });

  const form = useForm<IEditClientFormModel>({
    defaultValues: props.defaultValues,
    resolver: yupResolver(validationSchema),
  });

  return (
    <EditClientView
      form={form}
      onSubmit={props.onSubmit}
      onClose={props.onClose}
      onDelete={props.onDelete}
      clientId={props.clientId}
    />
  );
};

export default EditClientLogic;