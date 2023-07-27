import Reservation from "@/models/reservation/reservation-model";
import {
  Autocomplete,
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  InputAdornment,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import ExternalActionButton from "../UI/Button/ExternalActionButton";
import Client from "@/models/client-model";
import dayjs from "dayjs";
import ModalControls from "../UI/Modal/ModalControls";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useContext, useMemo, useState } from "react";
import { ReservationContext } from "@/store/reservation-context";
import { ClientContext } from "@/store/client-context";
import {
  IClientOption,
  NOT_SELECTED_CLIENT_OPTION,
  clientToOption,
  CLIENT_OPTION_SCHEMA,
} from "./client-option/clientOptionHelper";
import Group from "@/models/group/group-model";
import { GroupContext } from "@/store/group-context";

interface IReservationEditFormProps {
  reservation: Reservation;
  client: Client;
  onClose: () => void;
  onSubmit: (values: IReservationEditFormValues) => void;
  onDelete: () => void;
}

export interface IReservationEditFormValues {
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
  if(!value) return true;
  return dayjs.isDayjs(value);
});

const ReservationEditForm: React.FC<IReservationEditFormProps> = (props) => {
  const reservationCtx = useContext(ReservationContext);
  const clientCtx = useContext(ClientContext);
  const groupCtx = useContext(GroupContext);

  const reservationClient = useMemo(() => {
    const client = clientCtx.getClientById(props.reservation.clientId);
    return client ? client : { id: "not-selected", name: "" };
  }, [clientCtx.clients, props.reservation.clientId]);

  const clientOptions = useMemo<IClientOption[]>(() => {
    const options = clientCtx.clients.map((client) => {
      return {
        label: client.name,
        clientId: client.id,
      };
    });
    return [NOT_SELECTED_CLIENT_OPTION, ...options];
  }, [clientCtx.clients]);

  const canReserveEndDate = yup
    .mixed<dayjs.Dayjs>()
    .test("canReserveEndDate", "Ebben az időszakban van foglalás", function test(value) {
      if (!value || !dayjsSchema.isValidSync(value)) {
        return false;
      }
      let startDate = this.parent.startDate;
      if (!startDate || !dayjsSchema.isValidSync(startDate)) {
        return false;
      }
      startDate = dayjs(startDate);

      return reservationCtx.canReserve(startDate, value, this.parent.groupId, props.reservation.id);
    });

  const canReserveStartDate = yup
    .mixed<dayjs.Dayjs>()
    .test("canReserveStartDate", "Ebben az időszakban van foglalás", function test(value) {
      if (!value || !dayjsSchema.isValidSync(value)) {
        return false;
      }
      let endDate = this.parent.endDate;
      if (!endDate || !dayjsSchema.isValidSync(endDate)) {
        return false;
      }
      endDate = dayjs(endDate);

      return reservationCtx.canReserve(value, endDate, this.parent.groupId, props.reservation.id);
    });

  const validationSchema: yup.ObjectSchema<IReservationEditFormValues> = yup.object().shape({
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

  const {
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<IReservationEditFormValues>({
    defaultValues: {
      groupId: props.reservation.groupId,
      startDate: dayjs(props.reservation.startDate),
      startTime: props.reservation.startTime ? dayjs(props.reservation.startTime) : "",
      endDate: dayjs(props.reservation.endDate),
      endTime: props.reservation.endTime ? dayjs(props.reservation.endTime) : "",
      paymentState: props.reservation.paymentState,
      fullPrice: props.reservation.fullPrice,
      depositPrice: props.reservation.depositPrice,
      cautionPrice: props.reservation.cautionPrice,
      cautionReturned: props.reservation.cautionReturned,
      comment: props.reservation.comment,
      selectedClientOption: clientToOption(reservationClient),
      clientName: reservationClient.name,
      clientPhone: reservationClient.phone ? reservationClient.phone : "",
      clientEmail: reservationClient.email ? reservationClient.email : "",
      clientAddress: reservationClient.address ? reservationClient.address : "",
    },
    resolver: yupResolver(validationSchema),
  });

  const calculatePayToGo = (
    changedFullPrice?: number,
    changedCautionPrice?: number,
    changedDepositPrice?: number,
    changedCautionState?: boolean
  ) => {
    const fullPrice = changedFullPrice ? changedFullPrice : Number(getValues("fullPrice"));
    const depositPrice = changedDepositPrice ? changedDepositPrice : Number(getValues("depositPrice"));
    const cautionPrice = changedCautionPrice ? changedCautionPrice : Number(getValues("cautionPrice"));
    const cautionReturned = changedCautionState ? changedCautionState : Boolean(getValues("cautionReturned"));

    if (cautionReturned) {
      return fullPrice > depositPrice ? fullPrice - depositPrice : 0;
    } else {
      return fullPrice + cautionPrice > depositPrice ? fullPrice + cautionPrice - depositPrice : 0;
    }
  };

  const [payToGo, setPayToGo] = useState<number>(calculatePayToGo());
  const [selectedGroup, setSelectedGroup] = useState<Group | undefined>(groupCtx.getGroup(props.reservation.groupId));

  const updateClientData = (client?: Client) => {
    if (client && client.id !== "not-selected") {
      setValue("clientName", client.name);
      setValue("clientPhone", client.phone ? client.phone : "");
      setValue("clientEmail", client.email ? client.email : "");
      setValue("clientAddress", client.address ? client.address : "");
    } else {
      setValue("selectedClientOption", NOT_SELECTED_CLIENT_OPTION);
      setValue("clientName", "");
      setValue("clientPhone", "");
      setValue("clientEmail", "");
      setValue("clientAddress", "");
    }
  };

  const startDate = watch("startDate");

  return (
    <Box
      component="form"
      autoComplete="off"
      noValidate
      onSubmit={handleSubmit(props.onSubmit, (error) => console.log("error", error))}
    >
      <ModalControls title="Foglalás szerkesztése" onClose={props.onClose} onDelete={props.onDelete} isEdit saveButtonProps={{ type: "submit" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: "500" }}>
            Alapinformációk
          </Typography>
          <FormControl>
            <InputLabel id="groupId">Csoport</InputLabel>
            <Controller
              name="groupId"
              control={control}
              render={({ field }) => (
                <Select
                  labelId="groupId"
                  id="groupId"
                  label="Csoport"
                  required
                  value={field.value}
                  error={!!errors.groupId}
                  onChange={(event) => {
                    const group = groupCtx.getGroup(event.target.value);
                    if (!group) return;
                    setSelectedGroup(group);
                    field.onChange(group.id);
                  }}
                  ref={field.ref}
                >
                  {groupCtx.groups.map((group) => (
                    <MenuItem key={group.id} value={group.id}>
                      {group.title}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            <FormHelperText error={!!errors.groupId}>{errors.groupId?.message}</FormHelperText>
          </FormControl>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="Kezdő dátum"
                  orientation="portrait"
                  sx={{ flexGrow: 1 }}
                  slotProps={{
                    toolbar: {
                      toolbarFormat: "MMMM DD",
                    },
                    textField: {
                      helperText: errors.startDate && errors.startDate.message,
                      error: !!errors.startDate,
                      required: true,
                    },
                  }}
                  shouldDisableDate={(day) =>
                    !selectedGroup ||
                    reservationCtx.shouldDateBeDisabled(day, "startDate", selectedGroup.id, props.reservation.id)
                  }
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
              name="startTime"
              control={control}
              render={({ field }) => (
                <TimePicker
                  label="Kezdő időpont"
                  orientation="portrait"
                  value={field.value}
                  inputRef={field.ref}
                  onChange={(date) => field.onChange(date!)}
                />
              )}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Controller
              name="endDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="Záró dátum"
                  orientation="portrait"
                  sx={{ flexGrow: 1 }}
                  slotProps={{
                    toolbar: {
                      toolbarFormat: "MMMM DD",
                    },
                    textField: {
                      helperText: errors.endDate && errors.endDate.message,
                      error: !!errors.endDate,
                      required: true,
                    },
                  }}
                  shouldDisableDate={(day) => {
                    if (!selectedGroup) return true;
                    const latestReservation = reservationCtx.getLatestReservation(selectedGroup.id);
                    const nextReservation = reservationCtx.getNextReservation(startDate, selectedGroup.id);
                    return (
                      dayjs(day).isBefore(startDate) ||
                      dayjs(day).isSame(startDate) ||
                      reservationCtx.shouldDateBeDisabled(day, "endDate", selectedGroup.id, props.reservation.id) ||
                      (nextReservation &&
                        nextReservation.id !== props.reservation.id &&
                        day.isAfter(nextReservation?.startDate)) ||
                      (day.isAfter(latestReservation?.endDate) && //Ha a vizsgált nap a legutolsó foglalás után van
                        !day.isAfter(field.value) && //Engedélyezi a kiválasztott nap után lévő napokat
                        !day.isSame(field.value) && //Engedélyezi a kiválasztott napot
                        !day.isBefore(field.value) && //Engedélyezi a kiválasztott nap előtti napokat
                        latestReservation?.id !== props.reservation.id && //Kizárja a jelenlegi foglalást
                        latestReservation?.groupId === selectedGroup.id)
                    );
                  }}
                  value={field.value}
                  inputRef={field.ref}
                  onChange={(date) => field.onChange(date!)}
                />
              )}
            />
            <Controller
              name="endTime"
              control={control}
              render={({ field }) => (
                <TimePicker
                  label="Záró időpont"
                  orientation="portrait"
                  value={field.value}
                  inputRef={field.ref}
                  onChange={(date) => field.onChange(date!)}
                />
              )}
            />
          </Box>

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
                helperText={errors.fullPrice && errors.fullPrice.message}
                InputProps={{
                  endAdornment: <InputAdornment position="end">Ft</InputAdornment>,
                }}
                {...field}
                onChange={(event) => {
                  field.onChange(event);
                  setPayToGo(calculatePayToGo(Number(event.target.value)));
                }}
              />
            )}
          />
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Controller
              name="cautionPrice"
              control={control}
              rules={{ pattern: /^[0-9]*$/ }}
              render={({ field }) => (
                <TextField
                  id="cautionPrice"
                  label="Kaució"
                  type="number"
                  error={!!errors.cautionPrice}
                  helperText={errors.cautionPrice && errors.cautionPrice.message}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">Ft</InputAdornment>,
                  }}
                  {...field}
                  onChange={(event) => {
                    field.onChange(event);
                    setPayToGo(calculatePayToGo(undefined, Number(event.target.value)));
                  }}
                />
              )}
            />
            <Controller
              name="cautionReturned"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      checked={field.value}
                      onChange={(event) => {
                        field.onChange(event.target.checked);
                        setPayToGo(calculatePayToGo(undefined, undefined, undefined, event.target.checked));
                      }}
                      ref={field.ref}
                    />
                  }
                  label="Kaució vissza fizetve"
                  labelPlacement="end"
                  sx={{ paddingLeft: 2 }}
                />
              )}
            />
          </Box>

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
                helperText={errors.depositPrice && errors.depositPrice.message}
                InputProps={{
                  endAdornment: <InputAdornment position="end">Ft</InputAdornment>,
                }}
                {...field}
                onChange={(event) => {
                  field.onChange(event);
                  setPayToGo(calculatePayToGo(undefined, undefined, Number(event.target.value)));
                }}
              />
            )}
          />

          <TextField
            id="payToGo"
            name="payToGo"
            label="Fizetendő a helyszínen"
            type="number"
            value={payToGo}
            InputProps={{
              endAdornment: <InputAdornment position="end">Ft</InputAdornment>,
            }}
            onChange={(event) => {
              return;
            }}
          />

          <Controller
            name="comment"
            control={control}
            render={({ field }) => (
              <TextField
                id="comment"
                label="Megjegyzés"
                type="text"
                multiline
                rows={4}
                {...field}
                error={!!errors.comment}
                helperText={errors.comment?.message}
              />
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
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Ügyfél"
                    error={!!errors.selectedClientOption}
                    helperText={errors.selectedClientOption && errors.selectedClientOption.message}
                  />
                )}
                getOptionLabel={(option) => option.label}
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
              <TextField
                id="clientName"
                label="Név"
                type="text"
                error={!!errors.clientName}
                helperText={errors.clientName?.message}
                {...field}
              />
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
                  helperText={errors.clientPhone && errors.clientPhone.message}
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
                  helperText={errors.clientEmail && errors.clientEmail.message}
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
              <TextField
                id="clientAddress"
                label="Lakcím"
                type="text"
                error={!!errors.clientAddress}
                helperText={errors.clientAddress?.message}
                {...field}
              />
            )}
          />
        </Box>
      </ModalControls>
    </Box>
  );
};

export default ReservationEditForm;
