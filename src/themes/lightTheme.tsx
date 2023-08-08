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
      main: green[300],
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
      main: grey[300],
      contrastText: "#000",
    },
    isToday: {
      main: green[100],
      dark: green[600],
      contrastText: "white",
    },
    isWeekend: {
      main: grey[200],
      contrastText: "#000",
    },
    isWeekday: {
      main: "#fff",
      contrastText: "#000",
    },
    calendarControls: {
      main: grey[100],
      contrastText: "#000",
    },
    brandColor: {
      main: "#369ed4",
      contrastText: "#fffffe",
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
    isWeekend: Palette["primary"];
    isWeekday: Palette["primary"];
    calendarControls: Palette["primary"];
    brandColor: Palette["primary"];
  }
  interface PaletteOptions {
    notPaid?: PaletteOptions["primary"];
    depositPaid?: PaletteOptions["primary"];
    fullPaid?: PaletteOptions["primary"];
    cancelled?: PaletteOptions["primary"];
    blocked?: PaletteOptions["primary"];
    calendarBorder?: PaletteOptions["primary"];
    isToday?: PaletteOptions["primary"];
    isWeekend?: PaletteOptions["primary"];
    isWeekday?: PaletteOptions["primary"];
    calendarControls?: PaletteOptions["primary"];
    brandColor?: PaletteOptions["primary"];
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
    brandColor: true;
  }
}

export const lightTheme = createTheme(themeOptions);
