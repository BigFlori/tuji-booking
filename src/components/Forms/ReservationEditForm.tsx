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
import { useFormik } from "formik";
import Client from "@/models/client-model";
import dayjs from "dayjs";
import ModalControls from "../UI/Modal/ModalControls";
import { ChangeEvent } from "react";

interface ReservationEditFormProps {
  reservation: Reservation;
  client: Client;
  onClose: () => void;
  onSubmit: (values: ReservationEditFormValues) => void;
}

export interface ReservationEditFormValues {
  startDate: dayjs.Dayjs;
  endDate: dayjs.Dayjs;
  paymentState: string;
  fullPrice: number;
  depositPrice: number;
  comment?: string;
  clientId: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  clientAddress?: string;
}

const ReservationEditForm: React.FC<ReservationEditFormProps> = (props) => {
  const formik = useFormik<ReservationEditFormValues>({
    initialValues: {
      startDate: props.reservation.startDate,
      endDate: props.reservation.endDate,
      paymentState: props.reservation.paymentState,
      fullPrice: props.reservation.fullPrice,
      depositPrice: props.reservation.depositPrice,
      comment: props.reservation.comment,
      clientId: props.client.id,
      clientName: props.client.name,
      clientEmail: props.client.email,
      clientPhone: props.client.phone,
      clientAddress: props.client.address,
    },
    onSubmit: (values) => {
      console.log("submitting");
      console.log(values);
    },
  });

  return (
    <Box component="form" autoComplete="off" noValidate onSubmit={formik.handleSubmit}>
      <ModalControls title="Foglalás szerkesztése" onClose={props.onClose} saveButtonProps={{ type: "submit" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: "500" }}>
            Alapinformációk
          </Typography>
          <DatePicker
            label="Kezdő dátum"
            orientation="portrait"
            value={formik.values.startDate}
            onChange={(date) => formik.setFieldValue("startDate", date)}
            slotProps={{
              toolbar: {
                toolbarFormat: "MMMM DD",
              },
            }}
          />

          <DatePicker
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
            id="fullPrice"
            name="fullPrice"
            label="Teljes ár"
            type="number"
            value={formik.values.fullPrice}
            onChange={formik.handleChange}
            InputProps={{
              endAdornment: <InputAdornment position="end">Ft</InputAdornment>,
            }}
          />

          <TextField
            id="reservation-deposit-price"
            label="Foglaló"
            type="number"
            InputProps={{
              endAdornment: <InputAdornment position="end">Ft</InputAdornment>,
            }}
          />

          <TextField
            id="reservation-to-pay-price"
            label="Fizetendő a helyszínen"
            type="number"
            disabled
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
            value={formik.values.comment}
            onChange={formik.handleChange}
          />

          <Typography variant="body1" fontWeight="500" marginTop={2}>
            Ügyfél kiválasztása
          </Typography>
          <Autocomplete
            disablePortal
            id="reservation-client"
            options={[]}
            renderInput={(params) => <TextField {...params} label="Ügyfél" />}
          />

          <Typography variant="body1" fontWeight="500" marginTop={2}>
            Ügyfél adatai
          </Typography>
          <TextField id="reservation-client-name" label="Név" type="text" />

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField sx={{ flexGrow: 1 }} id="reservation-client-phone" label="Telefonszám" type="text" />
            <ExternalActionButton type="tel" value={""} />
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField sx={{ flexGrow: 1 }} id="reservation-client-email" label="E-mail cím" type="email" />
            <ExternalActionButton type="mailto" value={""} />
          </Box>

          <TextField id="reservation-client-address" label="Lakcím" type="text" />
        </Box>
      </ModalControls>
    </Box>
  );
};

export default ReservationEditForm;
