import Client from "@/models/client-model";
import * as yup from "yup";

export interface IClientOption {
  label: string;
  clientId: string;
}

export const NOT_SELECTED_CLIENT_OPTION: IClientOption = {
  label: "Nincs kiválasztva",
  clientId: "not-selected",
};

export const clientToOption = (client?: Client): IClientOption => {
  if (!client || client.id === "not-selected") return NOT_SELECTED_CLIENT_OPTION;
  return {
    label: client.name,
    clientId: client.id,
  };
};

export const CLIENT_OPTION_SCHEMA: yup.ObjectSchema<IClientOption> = yup.object().shape({
  label: yup.string().required(),
  clientId: yup.string().required(),
});
