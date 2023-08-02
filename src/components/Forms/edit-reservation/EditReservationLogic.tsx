import dayjs from "dayjs";
import { SubmitHandler, useForm } from "react-hook-form";
import { CLIENT_OPTION_SCHEMA, IClientOption, NOT_SELECTED_CLIENT_OPTION } from "../client-option/clientOptionHelper";
import EditReservationView from "./EditReservationView";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useContext, useMemo } from "react";
import { ClientContext } from "@/store/client-context";
import { ReservationContext } from "@/store/reservation-context";
import { IEditReservationFormModelWithEmptyDate } from "./EditReservationApollo";

interface IEditReservationLogicProps {
  defaultValues: IEditReservationFormModelWithEmptyDate;
  onSubmit: SubmitHandler<IEditReservationFormModel>;
  onClose: () => void;
  onDelete: () => void;
  reservationId: string;
  reservationGroupId: string;
}

export interface IEditReservationFormModel {
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

const EditReservationLogic: React.FC<IEditReservationLogicProps> = (props) => {
  const reservationCtx = useContext(ReservationContext);
  const clientCtx = useContext(ClientContext);

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

      return reservationCtx.canReserve(startDate, value, this.parent.groupId, props.reservationId);
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

      return reservationCtx.canReserve(value, endDate, this.parent.groupId, props.reservationId);
    });

  const validationSchema: yup.ObjectSchema<IEditReservationFormModel> = yup.object().shape({
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
    comment: yup.string().optional(),
    selectedClientOption: CLIENT_OPTION_SCHEMA.required(),
    clientName: yup.string().optional(),
    clientPhone: yup.string().optional(),
    clientEmail: yup.string().email().optional(),
    clientAddress: yup.string().optional(),
  });

  const clientOptions = useMemo<IClientOption[]>(() => {
    const options = clientCtx.clients.map((client) => {
      return {
        label: client.name,
        clientId: client.id,
      };
    });
    return [NOT_SELECTED_CLIENT_OPTION, ...options];
  }, [clientCtx.clients]);

  const form = useForm<IEditReservationFormModel>({
    defaultValues: props.defaultValues,
    resolver: yupResolver(validationSchema),
  });

  return (
    <EditReservationView
      form={form}
      onSubmit={props.onSubmit}
      onClose={props.onClose}
      onDelete={props.onDelete}
      clientOptions={clientOptions}
      reservationId={props.reservationId}
      reservationGroupId={props.reservationGroupId}
    />
  );
};

export default EditReservationLogic;
