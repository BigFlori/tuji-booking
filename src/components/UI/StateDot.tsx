import PaymentState from "@/models/reservation/payment-state-model";
import { Box, useTheme } from "@mui/material";

interface IStateDotProps {
  state: PaymentState;
}

const StateDot: React.FC<IStateDotProps> = (props: IStateDotProps) => {
  const theme = useTheme();

  const dotColor = () => {
    switch (props.state) {
      case PaymentState.FULL_PAID:
        return theme.palette.fullPaid.main;
      case PaymentState.DEPOSIT_PAID:
        return theme.palette.depositPaid.main;
      case PaymentState.NOT_PAID:
        return theme.palette.notPaid.main;
      case PaymentState.CANCELLED:
        return theme.palette.cancelled.main;
      case PaymentState.BLOCKED:
        return theme.palette.blocked.main;
      default:
        return theme.palette.notPaid.main;
    }
  };

  return (
    <Box sx={{ width: 12, height: 12, backgroundColor: dotColor(), borderRadius: "50%", display: "inline-block" }} />
  );
};

export default StateDot;
