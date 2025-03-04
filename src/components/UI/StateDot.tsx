import { usePaymentStateColor } from "@/hooks/usePaymentStateColor";
import PaymentState from "@/models/reservation/payment-state-model";
import { Box } from "@mui/material";

interface IStateDotProps {
  state: PaymentState;
}

const StateDot: React.FC<IStateDotProps> = (props: IStateDotProps) => {
  return (
    <Box sx={{ width: 12, height: 12, backgroundColor: usePaymentStateColor(props.state), borderRadius: "50%", display: "inline-block" }} />
  );
};

export default StateDot;
