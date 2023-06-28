import { lightGreen, orange, red } from "@mui/material/colors";
import { ThemeOptions, createTheme } from "@mui/material/styles";

export const themeOptions: ThemeOptions = {
  palette: {
    mode: "light",
    notPaid: {
      main: red[500],
      contrastText: "#fff",
    },
    depositPaid: {
      main: orange[400],
      contrastText: "#fff",
    },
    fullPaid: {
      main: lightGreen[600],
      contrastText: "#fff",
    },
    cancelled: {
      main: "#955ae8",
      contrastText: "#000",
    },
    blocked: {
      main: '#7d7d7d',
      contrastText: '#000',
    }
  },
};

declare module "@mui/material/styles" {
  interface Palette {
    notPaid: Palette["primary"];
    depositPaid: Palette["primary"];
    fullPaid: Palette["primary"];
    cancelled: Palette["primary"];
    blocked: Palette["primary"];
  }
  interface PaletteOptions {
    notPaid?: PaletteOptions["primary"];
    depositPaid?: PaletteOptions["primary"];
    fullPaid?: PaletteOptions["primary"];
    cancelled?: PaletteOptions["primary"];
    blocked?: PaletteOptions["primary"];
  }
}

declare module '@mui/material/Radio' {
  interface RadioPropsColorOverrides {
    notPaid: true;
    depositPaid: true;
    fullPaid: true;
    cancelled: true;
    blocked: true;
  }
}

export const lightTheme = createTheme(themeOptions);
