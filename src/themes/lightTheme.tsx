import { deepPurple, grey, lightGreen, orange, red } from "@mui/material/colors";
import { ThemeOptions, createTheme } from "@mui/material/styles";

export const themeOptions: ThemeOptions = {
  palette: {
    mode: "light",
    notPaid: {
      main: red[300],
      contrastText: "#fff",
    },
    depositPaid: {
      main: orange[300],
      contrastText: "#fff",
    },
    fullPaid: {
      main: lightGreen[400],
      contrastText: "#fff",
    },
    cancelled: {
      main: deepPurple[300],
      contrastText: "#000",
    },
    blocked: {
      main: grey[400],
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
