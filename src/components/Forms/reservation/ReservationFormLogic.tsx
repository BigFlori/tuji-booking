import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { CLIENT_OPTION_SCHEMA, IClientOption, NOT_SELECTED_CLIENT_OPTION } from "../client-option/clientOptionHelper";
import ReservationFormView from "./ReservationFormView";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMemo } from "react";
import { IReservationFormLogicProps, IReservationFormModel } from "./ReservationFormTypes";
import { useReservationContext } from "@/store/reservation-context";
import { useClientContext } from "@/store/client-context";

const dayjsSchema = yup.mixed<dayjs.Dayjs>().test("isDayjs", "Érvénytelen dátum", (value) => {
  if (!value) return true;
  return dayjs.isDayjs(value);
});

const ReservationFormLogic: React.FC<IReservationFormLogicProps> = (props) => {
  const reservationCtx = useReservationContext();
  const clientCtx = useClientContext();
  
  // Dátum validációs függvények
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

      // Edit mód esetén kizárjuk a saját foglalást az ellenőrzésből
      const reservationId = props.mode === 'edit' && props.reservation ? props.reservation.id : undefined;
      return reservationCtx.canReserve(startDate, value, this.parent.groupId, reservationId);
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

      // Edit mód esetén kizárjuk a saját foglalást az ellenőrzésből
      const reservationId = props.mode === 'edit' && props.reservation ? props.reservation.id : undefined;
      return reservationCtx.canReserve(value, endDate, this.parent.groupId, reservationId);
    });

  // Validációs schema
  const validationSchema: yup.ObjectSchema<IReservationFormModel> = yup.object().shape({
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
    clientEmail: yup.string().email("Valós email címet adj meg").optional(),
    clientAddress: yup.string().optional(),
  });

  // Ügyfél opciók összeállítása
  const clientOptions = useMemo<IClientOption[]>(() => {
    const options = clientCtx.clients.map((client) => {
      return {
        label: client.name,
        clientId: client.id,
      };
    });
    return [NOT_SELECTED_CLIENT_OPTION, ...options];
  }, [clientCtx.clients]);

  const form = useForm<IReservationFormModel>({
    defaultValues: props.defaultValues as IReservationFormModel,
    resolver: yupResolver(validationSchema),
  });

  return (
    <ReservationFormView
      mode={props.mode}
      form={form}
      onSubmit={props.onSubmit}
      onClose={props.onClose}
      onDelete={props.onDelete}
      clientOptions={clientOptions}
      reservation={props.reservation}
      disableDateChange={props.disableDateChange}
      disableGroupChange={props.disableGroupChange}
    />
  );
};

export default ReservationFormLogic;