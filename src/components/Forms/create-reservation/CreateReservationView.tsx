import { Controller, SubmitHandler, UseFormReturn } from "react-hook-form";
import { ICreateReservationFormModel } from "./CreateReservationLogic";
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
import ModalControls from "@/components/UI/Modal/ModalControls";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import Group from "@/models/group/group-model";
import { useState } from "react";
import { IClientOption, NOT_SELECTED_CLIENT_OPTION } from "../client-option/clientOptionHelper";
import Client from "@/models/client-model";
import dayjs from "dayjs";
import ClientSection from "@/components/ClientSearch/ClientSection";
import { useClientContext } from "@/store/client-context";
import { useGroupContext } from "@/store/group-context";
import { useReservationContext } from "@/store/reservation-context";

interface ICreateReservationViewProps {
  form: UseFormReturn<ICreateReservationFormModel>;
  onSubmit: SubmitHandler<ICreateReservationFormModel>;
  onClose: () => void;
  clientOptions: IClientOption[];
}

const CreateReservationView: React.FC<ICreateReservationViewProps> = (props) => {
  const clientCtx = useClientContext();
  const groupCtx = useGroupContext();
  const reservationCtx = useReservationContext();

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = props.form;

  //Fizetendő összeg kiszámítása
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

  const [selectedGroup, setSelectedGroup] = useState<Group | undefined>(undefined);
  const [payToGo, setPayToGo] = useState<number>(calculatePayToGo());

  //Ügyfél adatainak frissítése
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
    <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit(props.onSubmit)}>
      <ModalControls title="Új foglalás" onClose={props.onClose} saveButtonProps={{ type: "submit" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="body1">Alapinformációk</Typography>
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
                  shouldDisableDate={(day) => {
                    if (!selectedGroup) return true;
                    return reservationCtx.shouldDateBeDisabled(day, "startDate", selectedGroup.id);
                  }}
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
                      reservationCtx.shouldDateBeDisabled(day, "endDate", selectedGroup.id) ||
                      (nextReservation && day.isAfter(nextReservation?.startDate)) ||
                      (day.isAfter(latestReservation?.endDate) && //Ha a vizsgált nap a legutolsó foglalás után van
                        !day.isAfter(field.value) && //Engedélyezi a kiválasztott nap után lévő napokat
                        !day.isSame(field.value) && //Engedélyezi a kiválasztott napot
                        !day.isBefore(field.value) && //Engedélyezi a kiválasztott nap előtti napokat
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
            <FormLabel id="paymentState" required error={!!errors.paymentState}>
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
            name="expenses"
            control={control}
            rules={{ pattern: /^[0-9]*$/ }}
            render={({ field }) => (
              <TextField
                id="expenses"
                label="Költségek"
                type="number"
                error={!!errors.expenses}
                helperText={errors.expenses && errors.expenses.message}
                InputProps={{
                  endAdornment: <InputAdornment position="end">Ft</InputAdornment>,
                }}
                {...field}
              />
            )}
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

          <ClientSection
            control={control}
            setValue={setValue}
            getValues={getValues}
            errors={errors}
            clientOptions={props.clientOptions}
            defaultMode="search"
          />

        </Box>
      </ModalControls>
    </Box>
  );
};

export default CreateReservationView;
