import { ThemeOptions, createTheme } from "@mui/material/styles";

export const themeOptions: ThemeOptions = {
  palette: {
    mode: "light",
    cancelled: {
      main: "#955ae8",
      contrastText: "#000",
    },
    blocked: {
      main: '##7d7d7d',
      contrastText: '#000',
    }
  },
};

declare module "@mui/material/styles" {
  interface Palette {
    cancelled: Palette["primary"];
    blocked: Palette["primary"];
  }
  interface PaletteOptions {
    cancelled?: PaletteOptions["primary"];
    blocked?: PaletteOptions["primary"];
  }
}

declare module '@mui/material/Radio' {
  interface RadioPropsColorOverrides {
    cancelled: true;
    blocked: true;
  }
}

export const lightTheme = createTheme(themeOptions);
