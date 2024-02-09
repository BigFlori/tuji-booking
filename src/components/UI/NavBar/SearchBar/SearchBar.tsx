import { Box, IconButton, TextField, Theme, Typography, useMediaQuery } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import Client from "@/models/client-model";
import { ClientContext } from "@/store/client-context";
import CloseIcon from "@mui/icons-material/Close";
import SearchResults from "./SearchResults";
import Reservation from "@/models/reservation/reservation-model";
import { ReservationContext } from "@/store/reservation-context";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { searchReservationByClient } from "@/firebase/firestore-helpers/reservation/reservation-utils";
import { useUser } from "@/store/user-context";

interface ISearchBarProps {
  placeholder: string;
  onSearchModeChange: Dispatch<SetStateAction<boolean>>;
  searchMode: boolean;
}

const SearchBar: React.FC<ISearchBarProps> = (props: ISearchBarProps) => {
  const user = useUser();
  //950px a töréspont ami alatt mobil nézet van (md breakpoint 900px-nél van)
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down(950));
  const clientCtx = useContext(ClientContext);
  const reservationCtx = useContext(ReservationContext);

  const [modalOpened, setModalOpened] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [foundClients, setFoundClients] = useState<Client[]>([]);
  const [foundReservations, setFoundReservations] = useState<Reservation[]>([]);
  const [showResults, setShowResults] = useState(false);
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
      const dbReservations = clients.flatMap((client) => searchReservationByClient(user!, client.id));
      dbReservations.map((dbReservation) => {
        dbReservation.then((reservations) => {
          if (reservations) {
            reservations.map((reservation) => {
              if (reservationCtx.reservations.find((res) => res.id === reservation.id)) {
                return;
              }
              reservationCtx.setReservations((prevReservations) => [...prevReservations, reservation]);
              setFoundReservations((prevReservations) => [...prevReservations, reservation]);
            });
          }
        });
      });
    }, 200);

    setTypingTimeout(timeout);

    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [searchText, modalOpened]);

  const handleSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputText = event.target.value;
    setSearchText(inputText);
    if ((!inputText && inputText.trim() === "") || inputText.trim().length < 3 || inputText.trim().length > 50) {
      setFoundReservations([]);
    } else {
      setShowResults(true);
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node) && !modalOpened) {
      setShowResults(false);
    }
  };

  const handleFocus = () => {
    setShowResults(true);
  };

  const areResultsVisible = foundReservations.length > 0 && showResults;

  if (isMobile) {
    return (
      <>
        {!props.searchMode ? (
          //Alaphelyzetben a keresés gomb jelenik meg
          <IconButton size="small" onClick={() => props.onSearchModeChange(true)}>
            <SearchIcon sx={{ color: (theme) => theme.palette.brandColor.contrastText }} />
          </IconButton>
        ) : (
          //Keresés módban a kereső mező jelenik meg
          <Box
            width="100%"
            sx={{ display: "flex", gap: 2, position: "relative" }}
            onBlur={handleBlur}
            onFocus={handleFocus}
          >
            <IconButton
              onClick={() => {
                setSearchText("");
                setFoundReservations([]);
                props.onSearchModeChange(false);
              }}
            >
              <ArrowBackIcon sx={{ color: (theme) => theme.palette.brandColor.contrastText }} />
            </IconButton>
            <TextField
              id="search-bar"
              placeholder={props.placeholder}
              value={searchText}
              onChange={handleSearchTextChange}
              autoComplete="off"
              autoSave="off"
              variant="standard"
              fullWidth
              sx={{
                color: (theme) => theme.palette.brandColor.contrastText,
                "& .MuiInput-underline:after": {
                  borderBottomColor: (theme) => theme.palette.brandColor.contrastText,
                },
              }}
              InputProps={{
                sx: {
                  color: (theme) => theme.palette.brandColor.contrastText,
                  "& ::placeholder": {
                    color: (theme) => theme.palette.brandColor.contrastText,
                  },
                },
                startAdornment: (
                  <SearchIcon sx={{ color: (theme) => theme.palette.brandColor.contrastText, marginRight: 2 }} />
                ),
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
              }}
            />
            {areResultsVisible && (
              <SearchResults results={foundReservations} isModalOpened={modalOpened} setModalOpened={setModalOpened} />
            )}
          </Box>
        )}
      </>
    );
  }

  return (
    <Box
      onBlur={handleBlur}
      onFocus={handleFocus}
      sx={{
        position: "relative",
        width: 400,
      }}
    >
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
          borderBottomLeftRadius: areResultsVisible ? 0 : 12,
          borderBottomRightRadius: areResultsVisible ? 0 : 12,
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
      {areResultsVisible && !isMobile && (
        <SearchResults results={foundReservations} isModalOpened={modalOpened} setModalOpened={setModalOpened} />
      )}
    </Box>
  );
};

export default SearchBar;
