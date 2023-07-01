import Reservation from "@/models/reservation/reservation-model";
import {
  Autocomplete,
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import ExternalActionButton from "../UI/ExternalActionButton";
import Client from "@/models/client-model";
import dayjs from "dayjs";
import ModalControls from "../UI/Modal/ModalControls";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useContext, useMemo } from "react";
import { ReservationContext } from "@/store/reservation-context";
import { ClientContext } from "@/store/client-context";

interface ReservationEditFormProps {
  reservation: Reservation;
  client: Client;
  onClose: () => void;
  onSubmit: (values: ReservationEditFormValues) => void;
}

interface ClientOption {
  label: string;
  clientId: string;
}

export interface ReservationEditFormValues {
  startDate: dayjs.Dayjs;
  endDate: dayjs.Dayjs;
  paymentState: string;
  fullPrice?: number;
  depositPrice?: number;
  comment?: string;
  selectedClientOption: ClientOption;
  clientName?: string;
  clientPhone?: string;
  clientEmail?: string;
  clientAddress?: string;
}

const dayjsSchema = yup.mixed<dayjs.Dayjs>().test("isDayjs", "Érvénytelen dátum", (value) => {
  return dayjs.isDayjs(value);
});

const clientOptionSchema: yup.ObjectSchema<ClientOption> = yup.object().shape({
  label: yup.string().required(),
  clientId: yup.string().required(),
});

const validationSchema: yup.ObjectSchema<ReservationEditFormValues> = yup.object().shape({
  startDate: dayjsSchema.required("Kezdő dátum megadása kötelező"),
  endDate: dayjsSchema.required("Záró dátum megadása kötelező"),
  paymentState: yup.string().required("Fizetési állapot megadása kötelező"),
  fullPrice: yup
    .number()
    .transform((value) => (isNaN(value) ? 0 : value))
    .optional(),
  depositPrice: yup
    .number()
    .transform((value) => (isNaN(value) ? 0 : value))
    .optional(),
  comment: yup.string().optional(),
  selectedClientOption: clientOptionSchema.required(),
  clientName: yup.string().optional(),
  clientPhone: yup.string().optional(),
  clientEmail: yup.string().email().optional(),
  clientAddress: yup.string().optional(),
});

const notSelectedClientOption: ClientOption = {
  label: "Nincs kiválasztva",
  clientId: "not-selected",
};

const clientToOption = (client?: Client): ClientOption => {
  if (!client || client.id === "not-selected") return notSelectedClientOption;
  return {
    label: client.name,
    clientId: client.id,
  };
};

const ReservationEditForm: React.FC<ReservationEditFormProps> = (props) => {
  const reservationCtx = useContext(ReservationContext);
  const clientCtx = useContext(ClientContext);

  const reservationClient = useMemo(() => {
    const client = clientCtx.getClientById(props.reservation.clientId);
    return client ? client : { id: "not-selected", name: "" };
  }, [clientCtx.clients, props.reservation.clientId]);

  const clientOptions = useMemo<ClientOption[]>(() => {
    const options = clientCtx.clients.map((client) => {
      return {
        label: client.name,
        clientId: client.id,
      };
    });
    return [notSelectedClientOption, ...options];
  }, [clientCtx.clients]);

  const {
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ReservationEditFormValues>({
    defaultValues: {
      startDate: dayjs(props.reservation.startDate),
      endDate: dayjs(props.reservation.endDate),
      paymentState: props.reservation.paymentState,
      fullPrice: props.reservation.fullPrice,
      depositPrice: props.reservation.depositPrice,
      comment: props.reservation.comment,
      selectedClientOption: clientToOption(reservationClient),
      clientName: reservationClient.name,
      clientPhone: reservationClient.phone ? reservationClient.phone : "",
      clientEmail: reservationClient.email ? reservationClient.email : "",
      clientAddress: reservationClient.address ? reservationClient.address : "",
    },
    resolver: yupResolver(validationSchema),
  });

  const startDate = watch("startDate");
  const fullPrice = watch("fullPrice");
  const depositPrice = watch("depositPrice");
  const showPayToGo = fullPrice && depositPrice && fullPrice > depositPrice;

  const updateClientData = (client?: Client) => {
    if (client && client.id !== "not-selected") {
      setValue("clientName", client.name);
      setValue("clientPhone", client.phone ? client.phone : "");
      setValue("clientEmail", client.email ? client.email : "");
      setValue("clientAddress", client.address ? client.address : "");
    } else {
      setValue("selectedClientOption", notSelectedClientOption);
      setValue("clientName", "");
      setValue("clientPhone", "");
      setValue("clientEmail", "");
      setValue("clientAddress", "");
    }
  };

  return (
    <Box
      component="form"
      autoComplete="off"
      noValidate
      onSubmit={handleSubmit(props.onSubmit, (error) => console.log("error", error))}
    >
      <ModalControls title="Foglalás szerkesztése" onClose={props.onClose} saveButtonProps={{ type: "submit" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: "500" }}>
            Alapinformációk
          </Typography>
          <Controller
            name="startDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                label="Kezdő dátum"
                orientation="portrait"
                slotProps={{
                  toolbar: {
                    toolbarFormat: "MMMM DD",
                  },
                  textField: {
                    helperText: errors.startDate && "A kezdő dátumot kötelező megadni!",
                    error: !!errors.startDate,
                    required: true,
                  },
                }}
                shouldDisableDate={(day) => reservationCtx.shouldDateBeDisabled(day, props.reservation, "startDate")}
                value={field.value}
                inputRef={field.ref}
                onChange={(date) => {
                  setValue("endDate", date!.add(1, "day"));
                  field.onChange(date!);
                }}
              />
            )}
          />

          <Controller
            name="endDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                label="Záró dátum"
                orientation="portrait"
                slotProps={{
                  toolbar: {
                    toolbarFormat: "MMMM DD",
                  },
                  textField: {
                    helperText: errors.endDate && "A záró dátumot kötelező megadni!",
                    error: !!errors.endDate,
                    required: true,
                  },
                }}
                shouldDisableDate={(day) => {
                  const latestReservation = reservationCtx.getLatestReservation(props.reservation.groupId);
                  return (
                    dayjs(day).isBefore(startDate) ||
                    dayjs(day).isSame(startDate) ||
                    reservationCtx.shouldDateBeDisabled(day, props.reservation, "endDate") ||
                    (day.isAfter(latestReservation?.endDate) &&
                      // !day.isAfter(field.value) &&
                      !day.isSame(field.value) &&
                      // !day.isBefore(field.value) &&
                      latestReservation?.id !== props.reservation.id &&
                      latestReservation?.groupId === props.reservation.groupId)
                  );
                }}
                value={field.value}
                inputRef={field.ref}
                onChange={(date) => field.onChange(date!)}
              />
            )}
          />

          <FormControl sx={{ width: "fit-content" }}>
            <FormLabel id="reservation-payment-state-label" required error={!!errors.paymentState}>
              Foglalás állapota
            </FormLabel>
            <Controller
              name="paymentState"
              control={control}
              render={({ field }) => (
                <RadioGroup aria-label="reservation-payment-state" id="paymentState" sx={{ paddingLeft: 1 }} {...field}>
                  <FormControlLabel
                    value="NOT_PAID"
                    control={
                      <Radio
                        color="notPaid"
                        sx={(theme) => ({
                          color: theme.palette.notPaid.main,
                        })}
                      />
                    }
                    label="Fizetés hiánya"
                  />
                  <FormControlLabel
                    value="DEPOSIT_PAID"
                    control={
                      <Radio
                        color="depositPaid"
                        sx={(theme) => ({
                          color: theme.palette.depositPaid.main,
                        })}
                      />
                    }
                    label="Foglaló fizetve"
                  />
                  <FormControlLabel
                    value="FULL_PAID"
                    control={
                      <Radio
                        color="fullPaid"
                        sx={(theme) => ({
                          color: theme.palette.fullPaid.main,
                        })}
                      />
                    }
                    label="Teljesen fizetve"
                  />
                  <FormControlLabel
                    value="CANCELLED"
                    control={
                      <Radio
                        color="cancelled"
                        sx={(theme) => ({
                          color: theme.palette.cancelled.main,
                        })}
                      />
                    }
                    label="Törölve"
                  />
                  <FormControlLabel
                    value="BLOCKED"
                    control={
                      <Radio
                        color="blocked"
                        sx={(theme) => ({
                          color: theme.palette.blocked.main,
                        })}
                      />
                    }
                    label="Blokkolt"
                  />
                </RadioGroup>
              )}
            />
          </FormControl>

          <Typography variant="body1" fontWeight="500" marginTop={2}>
            Foglalás adatai
          </Typography>
          <Controller
            name="fullPrice"
            control={control}
            rules={{ pattern: /^[0-9]*$/ }}
            render={({ field }) => (
              <TextField
                id="fullPrice"
                label="Teljes ár"
                type="number"
                error={!!errors.fullPrice}
                helperText={errors.fullPrice && "Csak számot tartalmazhat!"}
                InputProps={{
                  endAdornment: <InputAdornment position="end">Ft</InputAdornment>,
                }}
                {...field}
              />
            )}
          />

          <Controller
            name="depositPrice"
            control={control}
            rules={{ pattern: /^[0-9]*$/ }}
            render={({ field }) => (
              <TextField
                id="depositPrice"
                label="Foglaló"
                type="number"
                error={!!errors.depositPrice}
                helperText={errors.depositPrice && "Csak számot tartalmazhat!"}
                InputProps={{
                  endAdornment: <InputAdornment position="end">Ft</InputAdornment>,
                }}
                {...field}
              />
            )}
          />

          <TextField
            id="payToGo"
            name="payToGo"
            label="Fizetendő a helyszínen"
            type="number"
            value={showPayToGo ? fullPrice - depositPrice : 0}
            InputProps={{
              endAdornment: <InputAdornment position="end">Ft</InputAdornment>,
            }}
            onChange={(e) => {
              return;
            }}
          />

          <Controller
            name="comment"
            control={control}
            render={({ field }) => (
              <TextField id="comment" label="Megjegyzés" type="text" multiline rows={4} {...field} />
            )}
          />

          <Typography variant="body1" fontWeight="500" marginTop={2}>
            Ügyfél kiválasztása
          </Typography>
          <Controller
            name="selectedClientOption"
            control={control}
            render={({ field }) => (
              <Autocomplete
                disablePortal
                id="selectedClientOption"
                options={clientOptions}
                renderInput={(params) => <TextField {...params} label="Ügyfél" error={!!errors.selectedClientOption} />}
                isOptionEqualToValue={(option, value) => option.clientId === value.clientId}
                {...field}
                value={field.value}
                onChange={(_, data) => {
                  field.onChange(data!);
                  updateClientData(clientCtx.getClientById(data?.clientId));
                }}
              />
            )}
          />

          <Typography variant="body1" fontWeight="500" marginTop={2}>
            Ügyfél adatai
          </Typography>
          <Controller
            name="clientName"
            control={control}
            render={({ field }) => (
              <TextField id="clientName" label="Név" type="text" error={!!errors.clientName} {...field} />
            )}
          />

          <Box sx={{ display: "flex", gap: 2 }}>
            <Controller
              name="clientPhone"
              control={control}
              render={({ field }) => (
                <TextField
                  sx={{ flexGrow: 1 }}
                  id="clientPhone"
                  label="Telefonszám"
                  type="text"
                  error={!!errors.clientPhone}
                  {...field}
                />
              )}
            />
            <ExternalActionButton type="tel" value={watch("clientPhone")} />
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Controller
              name="clientEmail"
              control={control}
              render={({ field }) => (
                <TextField
                  sx={{ flexGrow: 1 }}
                  id="clientEmail"
                  label="E-mail cím"
                  type="email"
                  error={!!errors.clientEmail}
                  helperText={errors.clientEmail && "Valós email címet adj meg!"}
                  {...field}
                />
              )}
            />
            <ExternalActionButton type="mailto" value={watch("clientEmail")} />
          </Box>

          <Controller
            name="clientAddress"
            control={control}
            render={({ field }) => (
              <TextField id="clientAddress" label="Lakcím" type="text" error={!!errors.clientAddress} {...field} />
            )}
          />
        </Box>
      </ModalControls>
    </Box>
  );
};

export default ReservationEditForm;
