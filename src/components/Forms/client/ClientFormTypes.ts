import Client from "@/models/client-model";
import { SubmitHandler, UseFormReturn } from "react-hook-form";

// Form mód típus
export type ClientFormMode = 'create' | 'edit';

// Közös form model
export interface IClientFormModel {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
}

// Logic komponens props
export interface IClientFormLogicProps {
  mode: ClientFormMode;
  defaultValues: IClientFormModel;
  onSubmit: SubmitHandler<IClientFormModel>;
  onClose: () => void;
  onDelete?: () => void;
  clientId?: string;
}

// View komponens props
export interface IClientFormViewProps {
  mode: ClientFormMode;
  form: UseFormReturn<IClientFormModel>;
  onSubmit: SubmitHandler<IClientFormModel>;
  onClose: () => void;
  onDelete?: () => void;
  clientId?: string;
}

// Apollo komponens props
export interface IClientFormApolloProps {
  mode: ClientFormMode;
  onClose: () => void;
  onSubmit?: (updatedClient?: Client) => void;
  client?: Client;
}