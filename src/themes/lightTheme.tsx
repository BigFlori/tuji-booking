import { ThemeOptions, createTheme } from "@mui/material/styles";

export const themeOptions: ThemeOptions = {
  palette: {
    mode: "light",
  },
};

export const lightTheme = createTheme(themeOptions);
