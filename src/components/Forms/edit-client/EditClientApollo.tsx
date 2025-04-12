import { useContext } from "react";
import { ClientContext } from "@/store/client-context";
import Client from "@/models/client-model";
import EditClientLogic, { IEditClientFormModel } from "./EditClientLogic";
import { SubmitHandler } from "react-hook-form";
import { useSnack } from "@/hooks/useSnack";

interface IEditClientApolloProps {
  onClose: () => void;
  onSubmit?: (updatedClient?: Client) => void;
  client: Client;
}

const EditClientApollo: React.FC<IEditClientApolloProps> = (props) => {
  const clientCtx = useContext(ClientContext);
  const showSnackbar = useSnack();

  const submitHandler: SubmitHandler<IEditClientFormModel> = (data) => {
    const modifiedClient: Client = {
      ...props.client,
      name: data.name,
      phone: data.phone,
      email: data.email,
      address: data.address,
    };

    // Ellenőrizzük, hogy új ügyfélről van-e szó (nincs még az adatbázisban)
    const isNewClient = !clientCtx.clients.find(c => c.id === props.client.id);

    if (isNewClient) {
      // Új ügyfél létrehozása esetén nem hívjuk meg a clientCtx.updateClient függvényt
      props.onSubmit && props.onSubmit(modifiedClient);
    } else {
      clientCtx.updateClient(props.client.id, modifiedClient);
      showSnackbar("Ügyfél módosítva!", "success");
      props.onSubmit && props.onSubmit(modifiedClient);
    }
    
    props.onClose();
  };

  const deleteHandler = () => {
    clientCtx.removeClient(props.client.id);
    showSnackbar("Ügyfél törölve!", "success");
    props.onClose();
  };

  const defaultValues: IEditClientFormModel = {
    name: props.client.name,
    phone: props.client.phone || "",
    email: props.client.email || "",
    address: props.client.address || "",
  };

  return (
    <EditClientLogic
      defaultValues={defaultValues}
      onSubmit={submitHandler}
      onClose={props.onClose}
      onDelete={deleteHandler}
      clientId={props.client.id}
      isNewClient={!clientCtx.clients.find(c => c.id === props.client.id)}
    />
  );
};

export default EditClientApollo;