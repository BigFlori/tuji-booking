import { useMemo, useState } from "react";
import { Controller } from "react-hook-form";
import Client from "@/models/client-model";
import Group from "@/models/group/group-model";
import { clientToOption, NOT_SELECTED_CLIENT_OPTION } from "../client-option/clientOptionHelper";
import {
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
import dayjs from "dayjs";
import { useIsDevMode } from "@/store/dev-context";
import { formatCurrency } from "@/utils/helpers";
import { useClientContext } from "@/store/client-context";
import { useReservationContext } from "@/store/reservation-context";
import { useGroupContext } from "@/store/group-context";
import ClientSection from "@/components/ClientSearch/ClientSection";
import { IReservationFormViewProps } from "./ReservationFormTypes";

const ReservationFormView: React.FC<IReservationFormViewProps> = (props) => {
  const clientCtx = useClientContext();
  const reservationCtx = useReservationContext();
  const groupCtx = useGroupContext();
  const isDevMode = useIsDevMode();

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = props.form;

  //Ha a teljes ár, a kaució vagy a foglaló megváltozik, akkor újra kiszámolja a fizetendő összeget
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

  const [summaryPrice, setSummaryPrice] = useState<number>(getValues("fullPrice") - getValues("expenses") || 0);
  const [payToGo, setPayToGo] = useState<number>(calculatePayToGo());
  const [selectedGroup, setSelectedGroup] = useState<Group | undefined>(
    props.mode === 'edit' && props.reservation 
    ? groupCtx.getGroup(props.reservation.groupId) 
    : undefined
  );

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

  // Csak Edit módban használjuk
  const reservationClient = useMemo(() => {
    if (props.mode === 'edit' && props.reservation) {
      const client = clientCtx.getClientById(props.reservation.clientId);
      return client ? client : { id: "not-selected", name: "" };
    }
    return { id: "not-selected", name: "" };
  }, [clientCtx.clients, props.reservation, props.mode]);

  // Kezdeti kiválasztott ügyfél - csak Edit módban használjuk
  const initialSelectedClient = useMemo(() => {
    return props.mode === 'edit' ? clientToOption(reservationClient) : NOT_SELECTED_CLIENT_OPTION;
  }, [reservationClient, props.mode]);

  const startDate = watch("startDate");

  return (
    <Box component="form" autoComplete="off" noValidate onSubmit={handleSubmit(props.onSubmit)}>
      <ModalControls
        title={props.mode === 'create' ? "Új foglalás" : "Foglalás szerkesztése"}
        onClose={props.onClose}
        onDelete={props.mode === 'edit' ? props.onDelete : undefined}
        isEdit={props.mode === 'edit'}
        saveButtonProps={{ type: "submit" }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="body1" fontWeight="500">
            Alapinformációk
          </Typography>
          <FormControl>
            <InputLabel id="groupId">Csoport</InputLabel>
            <Controller
              name="groupId"
              control={control}
              render={({ field }) => (
                <Select
                  disabled={props.disableGroupChange}
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
                  disabled={props.disableDateChange}
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
                    // Edit módban ki kell zárni a jelenlegi foglalást
                    const reservationId = props.mode === 'edit' && props.reservation ? props.reservation.id : undefined;
                    return reservationCtx.shouldDateBeDisabled(day, "startDate", selectedGroup.id, reservationId);
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
                  disabled={props.disableDateChange}
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
                    const reservationId = props.mode === 'edit' && props.reservation ? props.reservation.id : undefined;

                    return (
                      dayjs(day).isBefore(startDate) ||
                      dayjs(day).isSame(startDate) ||
                      reservationCtx.shouldDateBeDisabled(day, "endDate", selectedGroup.id, reservationId) ||
                      (nextReservation &&
                        nextReservation.id !== reservationId &&
                        day.isAfter(nextReservation?.startDate)) ||
                      (day.isAfter(latestReservation?.endDate) && //Ha a vizsgált nap a legutolsó foglalás után van
                        !day.isAfter(field.value) && //Engedélyezi a kiválasztott nap után lévő napokat
                        !day.isSame(field.value) && //Engedélyezi a kiválasztott napot
                        !day.isBefore(field.value) && //Engedélyezi a kiválasztott nap előtti napokat
                        latestReservation?.id !== reservationId && //Kizárja a jelenlegi foglalást
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
                  setSummaryPrice(Number(event.target.value) - getValues("expenses"));
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
                onChange={(event) => {
                  field.onChange(event);
                  setSummaryPrice(getValues("fullPrice") - Number(event.target.value));
                }}
              />
            )}
          />

          {props.mode === 'edit' && (
            <Typography variant="body1" fontWeight="500" marginLeft={1}>
              Összesítve: {summaryPrice > 0 ? "+" : ""}
              {formatCurrency(summaryPrice)}
            </Typography>
          )}

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
            defaultMode={props.mode === 'edit' ? "edit" : "search"}
            initialSelectedClient={props.mode === 'edit' ? initialSelectedClient : undefined}
          />
        </Box>
        
        {/* Dev mód extra információk - csak Edit módban */}
        {isDevMode && props.mode === 'edit' && props.reservation && (
          <Box sx={{ display: "flex", gap: 1, marginBlock: 2, flexDirection: "column" }}>
            <TextField id="reservationId" label="Foglalás azonosító" type="text" value={props.reservation.id} disabled />
            <TextField
              id="reservationGroupId"
              label="Csoport azonosító"
              type="text"
              value={props.reservation.groupId}
              disabled
            />
            <TextField
              id="reservationStartDate"
              label="Foglalás kezdete"
              type="text"
              value={startDate?.format("YYYY-MM-DD HH:mm") + " - " + startDate.unix()}
              disabled
            />
            <TextField
              id="reservationEndDate"
              label="Foglalás vége"
              type="text"
              value={watch("endDate")?.format("YYYY-MM-DD HH:mm") + " - " + watch("endDate").unix()}
              disabled
            />
          </Box>
        )}
      </ModalControls>
    </Box>
  );
};

export default ReservationFormView;