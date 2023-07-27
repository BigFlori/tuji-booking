import { deepPurple, green, grey, lightGreen, orange, red } from "@mui/material/colors";
import { ThemeOptions, createTheme } from "@mui/material/styles";

export const themeOptions: ThemeOptions = {
  palette: {
    mode: "light",
    notPaid: {
      main: red[300],
      contrastText: "#000",
    },
    depositPaid: {
      main: orange[300],
      contrastText: "#000",
    },
    fullPaid: {
      main: lightGreen[400],
      contrastText: "#000",
    },
    cancelled: {
      main: deepPurple[300],
      contrastText: "#000",
    },
    blocked: {
      main: grey[400],
      contrastText: '#000',
    },
    calendarBorder: {
      main: grey[200],
      contrastText: "#000",
    },
    isToday: {
      main: green[300],
      contrastText: "#000",
    },
    isTodayText: {
      main: green[600],
      contrastText: "#000",
    },
    isWeekend: {
      main: grey[100],
      contrastText: "#000",
    },
    isWeekday: {
      main: "#fff",
      contrastText: "#000",
    },
    calendarControls: {
      main: grey[50],
      contrastText: "#000",
    },
    appBarBg: {
      main: grey[700],
      contrastText: "#fff",
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
    calendarBorder: Palette["primary"];
    isToday: Palette["primary"];
    isTodayText: Palette["primary"];
    isWeekend: Palette["primary"];
    isWeekday: Palette["primary"];
    calendarControls: Palette["primary"];
    appBarBg: Palette["primary"];
  }
  interface PaletteOptions {
    notPaid?: PaletteOptions["primary"];
    depositPaid?: PaletteOptions["primary"];
    fullPaid?: PaletteOptions["primary"];
    cancelled?: PaletteOptions["primary"];
    blocked?: PaletteOptions["primary"];
    calendarBorder?: PaletteOptions["primary"];
    isToday?: PaletteOptions["primary"];
    isTodayText?: PaletteOptions["primary"];
    isWeekend?: PaletteOptions["primary"];
    isWeekday?: PaletteOptions["primary"];
    calendarControls?: PaletteOptions["primary"];
    appBarBg?: PaletteOptions["primary"];
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

declare module '@mui/material/AppBar' {
  interface AppBarPropsColorOverrides {
    appBarBg: true;
  }
}

export const lightTheme = createTheme(themeOptions);
