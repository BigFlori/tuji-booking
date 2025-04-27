import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ClientFormView from "./ClientFormView";
import { IClientFormLogicProps, IClientFormModel } from "./ClientFormTypes";

const ClientFormLogic: React.FC<IClientFormLogicProps> = (props) => {
  const validationSchema: yup.ObjectSchema<IClientFormModel> = yup.object().shape({
    name: yup.string().required("Név megadása kötelező"),
    phone: yup.string().optional(),
    email: yup.string().email("Érvénytelen email cím").optional(),
    address: yup.string().optional(),
  });

  const form = useForm<IClientFormModel>({
    defaultValues: props.defaultValues,
    resolver: yupResolver(validationSchema),
  });

  return (
    <ClientFormView
      mode={props.mode}
      form={form}
      onSubmit={props.onSubmit}
      onClose={props.onClose}
      onDelete={props.onDelete}
      clientId={props.clientId}
    />
  );
};

export default ClientFormLogic;