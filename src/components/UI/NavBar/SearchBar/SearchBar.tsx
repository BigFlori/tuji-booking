import { Box, IconButton, TextField, Theme, useMediaQuery } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Client from "@/models/client-model";
import CloseIcon from "@mui/icons-material/Close";
import SearchResults from "./SearchResults";
import Reservation from "@/models/reservation/reservation-model";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useClientContext } from "@/store/client-context";
import { useReservationContext } from "@/store/reservation-context";

interface ISearchBarProps {
  placeholder: string;
  onSearchModeChange: Dispatch<SetStateAction<boolean>>;
  searchMode: boolean;
}

const SearchBar: React.FC<ISearchBarProps> = (props: ISearchBarProps) => {
  //950px a töréspont ami alatt mobil nézet van (md breakpoint 900px-nél van)
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down(950));
  const clientCtx = useClientContext();
  const reservationCtx = useReservationContext();

  const [modalOpened, setModalOpened] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [foundClients, setFoundClients] = useState<Client[]>([]);
  const [foundReservations, setFoundReservations] = useState<Reservation[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | undefined>(undefined);

  // A keresési eredmények frissítése, amikor a felhasználó beír valamit a keresőmezőbe
  useEffect(() => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const timeout = setTimeout(async () => {
      if (searchText.trim() === "" || searchText.trim().length < 3 || searchText.trim().length > 50) {
        setFoundClients([]);
        setFoundReservations([]);
        return;
      }

      const clients = clientCtx.searchClients(searchText);
      const queryReservationsPromises = clients.map(async (client) => {
        return await reservationCtx.getReservationsByClient(client.id);
      });

      const allReservations = await Promise.all(queryReservationsPromises);

      const flattenedReservations = allReservations.flat();
      setFoundReservations(flattenedReservations);
    }, 200);

    setTypingTimeout(timeout);

    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [searchText, modalOpened]);

  // A keresési szöveg változásának kezelése
  const handleSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputText = event.target.value;
    setSearchText(inputText);
    if ((!inputText && inputText.trim() === "") || inputText.trim().length < 3 || inputText.trim().length > 50) {
      setFoundReservations([]);
    } else {
      setShowResults(true);
    }
  };

  // A keresési eredmények eltüntetése, ha a felhasználó a keresőmezőn kívülre kattint
  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node) && !modalOpened) {
      setShowResults(false);
    }
  };

  // A keresési eredmények megjelenítése, ha a felhasználó a keresőmezőre kattint
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
