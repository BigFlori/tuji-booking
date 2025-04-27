import Group from "@/models/group/group-model";
import { SubmitHandler, UseFormReturn } from "react-hook-form";

// Form mód típus
export type GroupFormMode = 'create' | 'edit';

// Közös form model
export interface IGroupFormModel {
  title: string;
  description?: string;
  state: string;
  type: string;
}

// Logic komponens props
export interface IGroupFormLogicProps {
  mode: GroupFormMode;
  defaultValues: IGroupFormModel;
  onSubmit: SubmitHandler<IGroupFormModel>;
  onClose: () => void;
  onDelete?: () => void;
}

// View komponens props
export interface IGroupFormViewProps {
  mode: GroupFormMode;
  form: UseFormReturn<IGroupFormModel>;
  onSubmit: SubmitHandler<IGroupFormModel>;
  onClose: () => void;
  onDelete?: () => void;
}

// Apollo komponens props
export interface IGroupFormApolloProps {
  mode: GroupFormMode;
  onClose: () => void;
  onSubmit?: (updatedGroup?: Group) => void;
  group?: Group;
}