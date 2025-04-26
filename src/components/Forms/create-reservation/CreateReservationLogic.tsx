import { SubmitHandler, useForm } from "react-hook-form";
import {
  CLIENT_OPTION_SCHEMA,
  IClientOption,
  NOT_SELECTED_CLIENT_OPTION,
  clientToOption,
} from "../client-option/clientOptionHelper";
import dayjs from "dayjs";
import * as yup from "yup";
import { useMemo } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import CreateReservationView from "./CreateReservationView";
import { ICreateReservationFormModelWithEmptyDate } from "./CreateReservationApollo";
import { useReservationContext } from "@/store/reservation-context";
import { useClientContext } from "@/store/client-context";

interface ICreateReservationLogicProps {
  defaultValues: ICreateReservationFormModelWithEmptyDate;
  onSubmit: SubmitHandler<ICreateReservationFormModel>;
  onClose: () => void;
}

export interface ICreateReservationFormModel {
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

const dayjsSchema = yup.mixed<dayjs.Dayjs>().test("isDayjs", "Érvénytelen dátum", (value) => {
  if (!value) return true;
  return dayjs.isDayjs(value);
});

const CreateReservationLogic: React.FC<ICreateReservationLogicProps> = (props) => {
  const reservationCtx = useReservationContext();
  const clientCtx = useClientContext();

  const canReserveEndDate = yup
    .mixed<dayjs.Dayjs>()
    .test("canReserveEndDate", "Ebben az időszakban van foglalás", function test(value) {
      if (!value || !dayjsSchema.isValidSync(value)) {
        return false;
      }
      let startDate = this.parent.startDate as dayjs.Dayjs;
      if (!startDate || !dayjsSchema.isValidSync(startDate)) {
        return false;
      }
      startDate = dayjs(startDate);

      return reservationCtx.canReserve(startDate, value, this.parent.groupId);
    });

  const canReserveStartDate = yup
    .mixed<dayjs.Dayjs>()
    .test("canReserveStartDate", "Ebben az időszakban van foglalás", function test(value) {
      if (!value || !dayjsSchema.isValidSync(value)) {
        return false;
      }
      let endDate = this.parent.endDate as dayjs.Dayjs;
      if (!endDate || !dayjsSchema.isValidSync(endDate)) {
        return false;
      }
      endDate = dayjs(endDate);

      return reservationCtx.canReserve(value, endDate, this.parent.groupId);
    });

  const validationSchema: yup.ObjectSchema<ICreateReservationFormModel> = yup.object().shape({
    groupId: yup.string().required("Csoport megadása kötelező"),
    startDate: canReserveStartDate.required("Kezdő dátum megadása kötelező"),
    startTime: dayjsSchema.optional(),
    endDate: canReserveEndDate.required("Záró dátum megadása kötelező"),
    endTime: dayjsSchema.optional(),
    paymentState: yup.string().required("Fizetési állapot megadása kötelező"),
    fullPrice: yup
      .number()
      .transform((value) => (isNaN(value) ? 0 : value))
      .required("Teljes ár megadása kötelező")
      .min(0, "Teljes ár nem lehet negatív"),
    depositPrice: yup
      .number()
      .transform((value) => (isNaN(value) ? 0 : value))
      .required("Előleg megadása kötelező")
      .min(0, "Előleg nem lehet negatív"),
    cautionPrice: yup
      .number()
      .transform((value) => (isNaN(value) ? 0 : value))
      .required("Kaució megadása kötelező")
      .min(0, "Kaució nem lehet negatív"),
    cautionReturned: yup.boolean().required(),
    expenses: yup
      .number()
      .transform((value) => (isNaN(value) ? 0 : value))
      .required("Költségek megadása kötelező")
      .min(0, "Költségek nem lehet negatív"),
    comment: yup.string().optional(),
    selectedClientOption: CLIENT_OPTION_SCHEMA.required("Ügyfél megadása kötelező"),
    clientName: yup.string().optional(),
    clientPhone: yup.string().optional(),
    clientEmail: yup.string().email().optional(),
    clientAddress: yup.string().optional(),
  });

  const clientOptions = useMemo<IClientOption[]>(() => {
    const options = clientCtx.clients.map((client) => clientToOption(client));
    return [NOT_SELECTED_CLIENT_OPTION, ...options];
  }, [clientCtx.clients]);

  const form = useForm<ICreateReservationFormModel>({
    defaultValues: props.defaultValues,
    resolver: yupResolver(validationSchema),
  });

  return (
    <CreateReservationView
      form={form}
      onSubmit={props.onSubmit}
      onClose={props.onClose}
      clientOptions={clientOptions}
    />
  );
};

export default CreateReservationLogic;
