import dayjs from "dayjs";
import { IClientOption } from "../client-option/clientOptionHelper";
import Reservation from "@/models/reservation/reservation-model";
import { SubmitHandler, UseFormReturn } from "react-hook-form";

// Form mód típus
export type ReservationFormMode = "create" | "edit";

// Közös form model
export interface IReservationFormModel {
  groupId: string;
  startDate: dayjs.Dayjs;
  startTime?: dayjs.Dayjs;
  endDate: dayjs.Dayjs;
  endTime?: dayjs.Dayjs;
  paymentState: string;
  fullPrice: number;
  depositPrice: number;
  cautionPrice: number;
  cautionReturned: boolean;
  expenses: number;
  comment?: string;
  selectedClientOption: IClientOption;
  clientName?: string;
  clientPhone?: string;
  clientEmail?: string;
  clientAddress?: string;
}

// Form modell az üres dátumokkal (kezdeti betöltéshez hasznos)
export type IReservationFormModelWithEmptyDate =
  | IReservationFormModel
  | {
      startDate: string | dayjs.Dayjs;
      startTime?: string | dayjs.Dayjs;
      endDate: string | dayjs.Dayjs;
      endTime?: string | dayjs.Dayjs;
      groupId: string;
      paymentState: string;
      fullPrice: number;
      depositPrice: number;
      cautionPrice: number;
      cautionReturned: boolean;
      expenses: number;
      comment?: string;
      selectedClientOption: IClientOption;
      clientName?: string;
      clientPhone?: string;
      clientEmail?: string;
      clientAddress?: string;
    };

// Logic komponens props
export interface IReservationFormLogicProps {
  mode: ReservationFormMode;
  defaultValues: IReservationFormModelWithEmptyDate;
  onSubmit: SubmitHandler<IReservationFormModel>;
  onClose: () => void;
  onDelete?: () => void;
  reservation?: Reservation;
  disableDateChange?: boolean;
  disableGroupChange?: boolean;
}

// View komponens props
export interface IReservationFormViewProps {
  mode: ReservationFormMode;
  form: UseFormReturn<IReservationFormModel>;
  onSubmit: SubmitHandler<IReservationFormModel>;
  onClose: () => void;
  onDelete?: () => void;
  clientOptions: IClientOption[];
  reservation?: Reservation;
  disableDateChange?: boolean;
  disableGroupChange?: boolean;
}

// Apollo komponens props
export interface IReservationFormApolloProps {
  mode: ReservationFormMode;
  onClose: () => void;
  onSubmit?: (updatedReservation?: Reservation) => void;
  reservation?: Reservation;
  disableDateChange?: boolean;
  disableGroupChange?: boolean;
  deleteEvent?: (deletedId: string) => void;
}
