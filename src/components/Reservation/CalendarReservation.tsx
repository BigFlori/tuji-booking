import { useState, useMemo, useContext, useReducer, SyntheticEvent } from "react";
import Reservation from "@/models/reservation/reservation-model";
import dayjs from "dayjs";
import { CALENDAR_ITEM_WIDTH, CALENDAR_MONTH_GAP } from "@/config/config";
import ReservationButton from "../UI/styled/ReservationButton";
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
import EditorModal from "../UI/EditorModal";
import { DatePicker } from "@mui/x-date-pickers";
import { ClientContext } from "@/store/client-context";
import { ReservationContext } from "@/store/reservation-context";
import Client from "@/models/client-model";
import PaymentState from "@/models/reservation/payment-state-model";

type CalendarReserverationProps = {
  reservation: Reservation;
};

type ClientOption = {
  label: string;
  id: string;
};

const countMonthsBetween = (startDate: dayjs.Dayjs, endDate: dayjs.Dayjs) => {
  return endDate.get("month") - startDate.get("month");
};

enum ActionType {
  SET_NAME = "SET_NAME",
  SET_PHONE = "SET_PHONE",
  SET_EMAIL = "SET_EMAIL",
  SET_ADDRESS = "SET_ADDRESS",
}

type ClientAction = {
  type: ActionType;
  payload: string;
};

type ClientState = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
};

const clientReducer = (state: ClientState, action: ClientAction) => {
  switch (action.type) {
    case ActionType.SET_NAME:
      return {
        ...state,
        name: action.payload,
      };
    case ActionType.SET_PHONE:
      return {
        ...state,
        phone: action.payload,
      };
    case ActionType.SET_EMAIL:
      return {
        ...state,
        email: action.payload,
      };
    case ActionType.SET_ADDRESS:
      return {
        ...state,
        address: action.payload,
      };
    default:
      return state;
  }
};

const selectedClientOptionInitialState = (client: Client | null) => ({
  label: client?.name || "Új ügyfél",
  id: client?.id || "new",
});

const CalendarReservation: React.FC<CalendarReserverationProps> = (props: CalendarReserverationProps) => {
  const clientCtx = useContext(ClientContext);
  const reservationCtx = useContext(ReservationContext);

  const reservationClient = useMemo(() => {
    return clientCtx.getClientById(props.reservation.clientId);
  }, [clientCtx.clients, props.reservation.clientId]);

  const [modalOpened, setModalOpened] = useState(false);

  const [selectedStartDate, setSelectedStartDate] = useState<dayjs.Dayjs | null>(props.reservation.startDate);
  const [selectedEndDate, setSelectedEndDate] = useState<dayjs.Dayjs | null>(props.reservation.endDate);
  const [selectedPaymentState, setSelectedPaymentState] = useState<string>(props.reservation.paymentState);
  const [fullPrice, setFullPrice] = useState(String(props.reservation.fullPrice));
  const [depositPrice, setDepositPrice] = useState(String(props.reservation.depositPrice));
  const [payToGo, setPayToGo] = useState(props.reservation.fullPrice - props.reservation.depositPrice);
  const [comment, setComment] = useState(props.reservation.comment);

  const [selectedClientOption, setSelectedClientOption] = useState<ClientOption>(
    selectedClientOptionInitialState(reservationClient)
  );
  const [clientState, dispatchClientState] = useReducer(clientReducer, {
    id: reservationClient?.id || "",
    name: reservationClient?.name || "",
    phone: reservationClient?.phone || "",
    email: reservationClient?.email || "",
    address: reservationClient?.address || "",
  });

  const width =
    props.reservation.endDate.diff(props.reservation.startDate, "day") * CALENDAR_ITEM_WIDTH +
    countMonthsBetween(props.reservation.startDate, props.reservation.endDate) * CALENDAR_MONTH_GAP -
    5;

  const left =
    props.reservation.startDate.diff(dayjs(props.reservation.startDate).startOf("month"), "day") * CALENDAR_ITEM_WIDTH +
    CALENDAR_ITEM_WIDTH / 2;

  const clientOptions = useMemo<ClientOption[]>(() => {
    const options = clientCtx.clients.map((client) => {
      return {
        label: client.name,
        id: client.id,
      };
    });
    return [{ label: "Új ügyfél", id: "new" }, ...options];
  }, [clientCtx.clients]);

  const handleFullPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setFullPrice(newValue);

    if (newValue && depositPrice) {
      setPayToGo(Number(newValue) - Number(depositPrice));
    } else {
      setPayToGo(Number(newValue));
    }
  };

  const handleDepositPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setDepositPrice(newValue);

    if (newValue && fullPrice) {
      setPayToGo(Number(fullPrice) - Number(newValue));
    } else {
      setPayToGo(Number(newValue));
    }
  };

  const handleClientOptionChange = (event: SyntheticEvent<Element, Event>, newClientOption: ClientOption | null) => {
    if (!newClientOption) return;

    setSelectedClientOption(newClientOption);
    if (newClientOption.id === "new") {
      dispatchClientState({ type: ActionType.SET_NAME, payload: "" });
      dispatchClientState({ type: ActionType.SET_PHONE, payload: "" });
      dispatchClientState({ type: ActionType.SET_EMAIL, payload: "" });
      dispatchClientState({ type: ActionType.SET_ADDRESS, payload: "" });
    } else {
      const client = clientCtx.getClientById(newClientOption.id);
      if (!client) return;
      dispatchClientState({ type: ActionType.SET_NAME, payload: client.name });
      dispatchClientState({ type: ActionType.SET_PHONE, payload: client.phone ? client.phone : "" });
      dispatchClientState({ type: ActionType.SET_EMAIL, payload: client.email ? client.email : "" });
      dispatchClientState({ type: ActionType.SET_ADDRESS, payload: client.address ? client.address : "" });
    }
  };

  const resetStates = () => {
    setSelectedStartDate(props.reservation.startDate);
    setSelectedEndDate(props.reservation.endDate);
    setSelectedPaymentState(props.reservation.paymentState);
    setFullPrice(String(props.reservation.fullPrice));
    setDepositPrice(String(props.reservation.depositPrice));
    setPayToGo(props.reservation.fullPrice - props.reservation.depositPrice);
    setComment(props.reservation.comment);
    setSelectedClientOption(selectedClientOptionInitialState(reservationClient));
    dispatchClientState({
      type: ActionType.SET_NAME,
      payload: reservationClient?.name ? reservationClient.name : "",
    });
    dispatchClientState({
      type: ActionType.SET_PHONE,
      payload: reservationClient?.phone ? reservationClient.phone : "",
    });
    dispatchClientState({
      type: ActionType.SET_EMAIL,
      payload: reservationClient?.email ? reservationClient.email : "",
    });
    dispatchClientState({
      type: ActionType.SET_ADDRESS,
      payload: reservationClient?.address ? reservationClient.address : "",
    });
  };

  const handleModalClose = () => {
    setModalOpened(false);
    resetStates();
  };

  const saveReservationHandler = () => {
    if (!selectedStartDate || !selectedEndDate) return;

    const paymentState: PaymentState | undefined = Object.values(PaymentState).find(
      (state) => state === selectedPaymentState
    );

    if(!paymentState) return;

    const reservation: Reservation = {
      ...props.reservation,
      startDate: selectedStartDate,
      endDate: selectedEndDate,
      paymentState: paymentState,
      fullPrice: Number(fullPrice),
      depositPrice: Number(depositPrice),
      comment: comment,
      clientId: clientState.id,
    };

    if (selectedClientOption.id === "new") {
      const client: Client = {
        id: "asd",
        name: clientState.name,
        phone: clientState.phone,
        email: clientState.email,
        address: clientState.address,
      };
      clientCtx.addClient(client);
      reservation.clientId = client.id;
    }

    reservationCtx.updateReservation(props.reservation.id, reservation);

    handleModalClose();
  };

  return (
    <>
      <ReservationButton sx={{ left, width }} onClick={() => setModalOpened(true)}>
        {reservationClient?.name}
      </ReservationButton>
      <EditorModal
        open={modalOpened}
        onClose={handleModalClose}
        onSave={saveReservationHandler}
        title="Foglalás szerkesztése"
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <DatePicker
            value={selectedStartDate}
            onChange={(newValue) => setSelectedStartDate(newValue)}
            label="Kezdő dátum"
            orientation="portrait"
            slotProps={{
              toolbar: {
                toolbarFormat: "MMMM DD",
              },
            }}
          />

          <DatePicker
            value={selectedEndDate}
            onChange={(newValue) => setSelectedEndDate(newValue)}
            label="Záró dátum"
            orientation="portrait"
            slotProps={{
              toolbar: {
                toolbarFormat: "MMMM DD",
              },
            }}
          />

          <FormControl sx={{ width: "fit-content" }}>
            <FormLabel id="reservation-payment-state-label">Foglalás állapota</FormLabel>
            <RadioGroup
              aria-label="reservation-payment-state"
              name="reservation-payment-state"
              id="reservation-payment-state"
              value={selectedPaymentState}
              onChange={(event) => setSelectedPaymentState(event.target.value)}
              sx={{ paddingLeft: 1 }}
            >
              <FormControlLabel
                value="NOT_PAID"
                control={
                  <Radio
                    color="error"
                    sx={(theme) => ({
                      color: theme.palette.error.main,
                    })}
                  />
                }
                label="Fizetés hiánya"
              />
              <FormControlLabel
                value="DEPOSIT_PAID"
                control={
                  <Radio
                    color="warning"
                    sx={(theme) => ({
                      color: theme.palette.warning.main,
                    })}
                  />
                }
                label="Foglaló fizetve"
              />
              <FormControlLabel
                value="FULL_PAID"
                control={
                  <Radio
                    color="success"
                    sx={(theme) => ({
                      color: theme.palette.success.main,
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
          </FormControl>

          <Typography variant="body1" fontWeight="500" marginTop={2}>
            Foglalás adatai
          </Typography>
          <TextField
            id="reservation-full-price"
            label="Teljes ár"
            //type="number"
            value={fullPrice}
            onChange={handleFullPriceChange}
            InputProps={{
              endAdornment: <InputAdornment position="end">Ft</InputAdornment>,
            }}
          />

          <TextField
            id="reservation-deposit-price"
            label="Foglaló"
            type="number"
            value={depositPrice}
            onChange={handleDepositPriceChange}
            InputProps={{
              endAdornment: <InputAdornment position="end">Ft</InputAdornment>,
            }}
          />

          <TextField
            id="reservation-to-pay-price"
            label="Fizetendő a helyszínen"
            type="number"
            disabled
            value={payToGo}
            InputProps={{
              endAdornment: <InputAdornment position="end">Ft</InputAdornment>,
            }}
          />

          <TextField
            id="reservation-comment"
            label="Megjegyzés"
            type="text"
            multiline
            rows={4}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />

          <Typography variant="body1" fontWeight="500" marginTop={2}>
            Ügyfél kiválasztása
          </Typography>
          <Autocomplete
            disablePortal
            id="reservation-client"
            options={clientOptions}
            value={selectedClientOption}
            onChange={handleClientOptionChange}
            renderInput={(params) => <TextField {...params} label="Ügyfél" />}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />

          <Typography variant="body1" fontWeight="500" marginTop={2}>
            Ügyfél adatai
          </Typography>
          <TextField
            id="reservation-client-name"
            label="Név"
            type="text"
            value={clientState.name}
            onChange={(event) => dispatchClientState({ type: ActionType.SET_NAME, payload: event.target.value })}
          />

          <TextField
            id="reservation-client-phone"
            label="Telefonszám"
            type="text"
            value={clientState.phone}
            onChange={(event) => dispatchClientState({ type: ActionType.SET_PHONE, payload: event.target.value })}
          />

          <TextField
            id="reservation-client-email"
            label="E-mail cím"
            type="email"
            value={clientState.email}
            onChange={(event) => dispatchClientState({ type: ActionType.SET_EMAIL, payload: event.target.value })}
          />

          <TextField
            id="reservation-client-address"
            label="Lakcím"
            type="text"
            value={clientState.address}
            onChange={(event) => dispatchClientState({ type: ActionType.SET_ADDRESS, payload: event.target.value })}
          />
        </Box>
      </EditorModal>
    </>
  );
};

export default CalendarReservation;
