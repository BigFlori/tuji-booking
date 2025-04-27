import PaymentState from "@/models/reservation/payment-state-model";
import { useTheme } from "@mui/material";

// Ez a hook a foglalások fizetési állapota alapján visszaadja a megfelelő színt
export const usePaymentStateColor = (state: PaymentState) => {
  const theme = useTheme();
  switch (state) {
    case PaymentState.NOT_PAID:
      return theme.palette.notPaid.main;
    case PaymentState.DEPOSIT_PAID:
      return theme.palette.depositPaid.main;
    case PaymentState.FULL_PAID:
      return theme.palette.fullPaid.main;
    case PaymentState.CANCELLED:
      return theme.palette.cancelled.main;
    case PaymentState.BLOCKED:
      return theme.palette.blocked.main;
    default:
      return theme.palette.notPaid.main;
  }
};