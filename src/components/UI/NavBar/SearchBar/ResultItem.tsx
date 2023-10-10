import Reservation from "@/models/reservation/reservation-model";
import { Box, ListItemButton, Typography } from "@mui/material";
import StateDot from "./StateDot";
import { useClientContext } from "@/store/client-context";
import { useGroupContext } from "@/store/group-context";

interface IResultItemProps {
  onClick: (result: Reservation) => void;
  result: Reservation;
}

const ResultItem: React.FC<IResultItemProps> = (props: IResultItemProps) => {
  const clientCtx = useClientContext();
  const groupCtx = useGroupContext();
  const client = clientCtx.getClientById(props.result.clientId)!;

  return (
    <ListItemButton sx={{ paddingY: 1 }} onClick={() => props.onClick(props.result)}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <StateDot state={props.result.paymentState} />
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography variant="body1">{client.name}</Typography>
          <Typography variant="body2">{client.phone}</Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Typography variant="body2">Kezdés: {props.result.startDate.format("YYYY.MM.DD")}</Typography>
            <Typography variant="body2">Zárás: {props.result.endDate.format("YYYY.MM.DD")}</Typography>
          </Box>
          <Typography variant="body2">{groupCtx.getGroup(props.result.groupId)?.title}</Typography>
        </Box>
      </Box>
    </ListItemButton>
  );
};

export default ResultItem;
