import React, { useState, useEffect, useRef } from "react";
import {
  TextField,
  Paper,
  Box,
  List,
  ListItem,
  ListItemText,
  ClickAwayListener,
  Typography,
  CircularProgress,
} from "@mui/material";

import { normalizeText } from "@/utils/helpers";
import { IClientOption, NOT_SELECTED_CLIENT_OPTION } from "../Forms/client-option/clientOptionHelper";

interface ClientSearchProps {
  id: string;
  options: IClientOption[];
  value: IClientOption;
  onChange: (option: IClientOption) => void;
  onClientDataChange: (clientId?: string) => void;
  label?: string;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  required?: boolean;
}

const ClientSearch: React.FC<ClientSearchProps> = ({
  id,
  options,
  value,
  onChange,
  onClientDataChange,
  label = "Ügyfél neve",
  placeholder = "Kezdje el gépelni az ügyfél nevét...",
  error,
  helperText,
  required = false,
}) => {
  // Különválasztjuk a beviteli értéket és a kiválasztott értéket
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<IClientOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Amikor egy új értéket választunk ki, frissítjük a beviteli mezőt is
  useEffect(() => {
    if (value && value.clientId !== "not-selected") {
      setInputValue(value.label);
    }
  }, [value]);

  // Keresés filteres
  useEffect(() => {
    const search = async () => {
      if (!inputValue.trim()) {
        setFilteredOptions([]);
        return;
      }

      setIsLoading(true);

      try {
        const normalizedInput = normalizeText(inputValue);
        const filtered = options.filter((option) => normalizeText(option.label).includes(normalizedInput)).slice(0, 50); // Maximum 50 találat a teljesítmény miatt

        setFilteredOptions(filtered);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce a kereséshez - csak 200ms inaktivitás után indul a keresés
    const timer = setTimeout(() => {
      search();
    }, 200);

    return () => clearTimeout(timer);
  }, [inputValue, options]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Ha teljesen kitöröljük az értéket, visszaállítjuk az alapértelmezettre
    if (!newValue.trim()) {
      onChange(NOT_SELECTED_CLIENT_OPTION);
      onClientDataChange(undefined);
    }

    setIsOpen(true);
  };

  const handleOptionSelect = (option: IClientOption) => {
    setInputValue(option.label);
    onChange(option);
    onClientDataChange(option.clientId === "not-selected" ? undefined : option.clientId);
    setIsOpen(false);
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  return (
    <ClickAwayListener onClickAway={() => setIsOpen(false)}>
      <Box sx={{ position: "relative", width: "100%" }}>
        <TextField
          id={id}
          label={label}
          placeholder={placeholder}
          fullWidth
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          error={error}
          helperText={helperText}
          required={required}
          InputProps={{
            ref: inputRef,
            endAdornment: isLoading ? <CircularProgress size={20} color="inherit" /> : null,
          }}
        />

        {isOpen && filteredOptions.length > 0 && (
          <Paper
            sx={{
              position: "absolute",
              zIndex: 1000,
              mt: 0.5,
              width: "100%",
              maxHeight: 300,
              overflow: "auto",
              boxShadow: 3,
            }}
          >
            <List disablePadding>
              {filteredOptions.map((option) => (
                <ListItem
                  key={option.clientId}
                  sx={{
                    py: 1,
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: (theme) => theme.palette.action.hover,
                    },
                  }}
                  onClick={() => handleOptionSelect(option)}
                >
                  <ListItemText primary={option.label} />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}

        {isOpen && inputValue.trim() && filteredOptions.length === 0 && !isLoading && (
          <Paper
            sx={{
              position: "absolute",
              zIndex: 1000,
              mt: 0.5,
              width: "100%",
              p: 2,
              boxShadow: 3,
            }}
          >
            <Typography color="text.secondary">Nincs találat</Typography>
          </Paper>
        )}
      </Box>
    </ClickAwayListener>
  );
};

export default ClientSearch;
