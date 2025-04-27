import Reservation from "@/models/reservation/reservation-model";
import { Box, ListItemButton, Typography } from "@mui/material";
import StateDot from "../StateDot";
import { useClientContext } from "@/store/client-context";
import { useGroupContext } from "@/store/group-context";

interface IReservationCardProps {
  onClick: (result: Reservation) => void;
  reservation: Reservation;
}

// Foglalás kártya komponens, amely fontosabb infókat jelenít meg a foglalásról
const ReservationCard: React.FC<IReservationCardProps> = (props: IReservationCardProps) => {
  const clientCtx = useClientContext();
  const groupCtx = useGroupContext();
  const client = clientCtx.getClientById(props.reservation.clientId)!;

  return (
    <ListItemButton sx={{ paddingY: 1 }} onClick={() => props.onClick(props.reservation)}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <StateDot state={props.reservation.paymentState} />
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography variant="body1">{client.name}</Typography>
          <Typography variant="body2">{client.phone}</Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Typography variant="body2">Kezdés: {props.reservation.startDate.format("YYYY.MM.DD")}</Typography>
            <Typography variant="body2">Zárás: {props.reservation.endDate.format("YYYY.MM.DD")}</Typography>
          </Box>
          <Typography variant="body2">{groupCtx.getGroup(props.reservation.groupId)?.title}</Typography>
        </Box>
      </Box>
    </ListItemButton>
  );
};

export default ReservationCard;
