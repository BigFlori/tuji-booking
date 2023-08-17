import Reservation from "@/models/reservation/reservation-model";
import { ClientContext } from "@/store/client-context";
import { List, ListItem, Paper } from "@mui/material";
import { useContext } from "react";

interface ISearchResultsProps {
  results: Reservation[];
}

const SearchResults: React.FC<ISearchResultsProps> = (props: ISearchResultsProps) => {
  const clientCtx = useContext(ClientContext);

  if (props.results.length === 0) return <></>;

  return (
    <Paper
      sx={{
        position: "absolute",
        zIndex: 10,
        width: "100%",
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        // backgroundColor: (theme) => theme.palette.brandColor.light,
        // color: (theme) => theme.palette.brandColor.contrastText,
      }}
    >
      <List>
        {props.results.map((reservation) => {
          const client = clientCtx.getClientById(reservation.clientId);
          return <ListItem key={reservation.id}>{client?.name}</ListItem>;
        })}
      </List>
    </Paper>
  );
};

export default SearchResults;
