import Client from "@/models/client-model";
import ClientFormLogic from "./ClientFormLogic";
import { IClientFormApolloProps, IClientFormModel } from "./ClientFormTypes";
import { SubmitHandler } from "react-hook-form";
import { useSnack } from "@/hooks/useSnack";
import { useClientContext } from "@/store/client-context";
import { v4 as uuidv4 } from "uuid";

const ClientFormApollo: React.FC<IClientFormApolloProps> = (props) => {
  const clientCtx = useClientContext();
  const showSnackbar = useSnack();

  const submitHandler: SubmitHandler<IClientFormModel> = (data) => {
    if (props.mode === 'create') {
      // Új ügyfél létrehozása
      const newClient: Client = {
        id: uuidv4(),
        name: data.name,
        phone: data.phone,
        email: data.email,
        address: data.address,
      };

      clientCtx.addClient(newClient);
      showSnackbar("Ügyfél sikeresen létrehozva!", "success");
      props.onSubmit && props.onSubmit(newClient);
    } else if (props.mode === 'edit' && props.client) {
      // Meglévő ügyfél módosítása
      const modifiedClient: Client = {
        ...props.client,
        name: data.name,
        phone: data.phone,
        email: data.email,
        address: data.address,
      };

      clientCtx.updateClient(props.client.id, modifiedClient);
      showSnackbar("Ügyfél módosítva!", "success");
      props.onSubmit && props.onSubmit(modifiedClient);
    }
    
    props.onClose();
  };

  const deleteHandler = () => {
    if (props.mode === 'edit' && props.client) {
      clientCtx.removeClient(props.client.id);
      showSnackbar("Ügyfél törölve!", "success");
      props.onClose();
    }
  };

  // Default értékek összeállítása a form mód alapján
  let defaultValues: IClientFormModel;

  if (props.mode === 'create') {
    defaultValues = {
      name: "",
      phone: "",
      email: "",
      address: "",
    };
  } else {
    // Edit mód esetén az aktuális ügyfél adataival töltjük fel
    if (!props.client) {
      throw new Error("Client is required in edit mode");
    }
    
    defaultValues = {
      name: props.client.name,
      phone: props.client.phone || "",
      email: props.client.email || "",
      address: props.client.address || "",
    };
  }

  return (
    <ClientFormLogic
      mode={props.mode}
      defaultValues={defaultValues}
      onSubmit={submitHandler}
      onClose={props.onClose}
      onDelete={props.mode === 'edit' ? deleteHandler : undefined}
      clientId={props.client?.id}
    />
  );
};

export default ClientFormApollo;