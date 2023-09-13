import { Box, IconButton, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useContext, useEffect, useState } from "react";
import Client from "@/models/client-model";
import { ClientContext } from "@/store/client-context";
import CloseIcon from "@mui/icons-material/Close";
import SearchResults from "./SearchResults";
import Reservation from "@/models/reservation/reservation-model";
import { ReservationContext } from "@/store/reservation-context";

interface ISearchBarProps {
  placeholder: string;
}

const SearchBar: React.FC<ISearchBarProps> = (props: ISearchBarProps) => {
  const clientCtx = useContext(ClientContext);
  const reservationCtx = useContext(ReservationContext);

  const [searchText, setSearchText] = useState("");
  const [foundClients, setFoundClients] = useState<Client[]>([]);
  const [foundReservations, setFoundReservations] = useState<Reservation[]>([]);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const timeout = setTimeout(() => {
      if (searchText.trim() === "" || searchText.trim().length < 3 || searchText.trim().length > 50) {
        setFoundClients([]);
        return;
      }
      const clients = clientCtx.searchClients(searchText);
      const reservations = clients.flatMap((client) => reservationCtx.getReservationsByClient(client.id));
      setFoundReservations(reservations);
    }, 1000);

    setTypingTimeout(timeout);

    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [searchText]);

  const handleSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputText = event.target.value;
    setSearchText(inputText);
    if ((!inputText && inputText.trim() === "") || inputText.trim().length < 3 || inputText.trim().length > 50) {
      setFoundReservations([]);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  return (
    <Box sx={{ position: "relative", width: 400 }}>
      <TextField
        id="search-bar"
        placeholder={props.placeholder}
        size="small"
        value={searchText}
        onChange={handleSearchTextChange}
        autoComplete="off"
        autoSave="off"
        sx={{
          backgroundColor: (theme) => theme.palette.brandColor.light,
          color: (theme) => theme.palette.brandColor.contrastText,
          borderRadius: 3,
          borderBottomLeftRadius: foundReservations.length > 0 ? 0 : 12,
          borderBottomRightRadius: foundReservations.length > 0 ? 0 : 12,
          width: "100%",
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              border: "none",
            },
            "&:hover fieldset": {
              border: "none",
            },
            "&.Mui-focused fieldset": {
              border: "none",
            },
          },
        }}
        InputProps={{
          sx: {
            color: (theme) => theme.palette.brandColor.contrastText,
            "& ::placeholder": {
              color: (theme) => theme.palette.brandColor.contrastText,
            },
          },
          endAdornment: (
            <IconButton
              onClick={() => {
                setSearchText("");
                setFoundReservations([]);
              }}
              size="small"
            >
              <CloseIcon sx={{ color: (theme) => theme.palette.brandColor.contrastText }} />
            </IconButton>
          ),
          startAdornment: (
            <IconButton size="small">
              <SearchIcon sx={{ color: (theme) => theme.palette.brandColor.contrastText }} />
            </IconButton>
          ),
        }}
      />
      <SearchResults results={foundReservations} />
    </Box>
  );
};

export default SearchBar;
