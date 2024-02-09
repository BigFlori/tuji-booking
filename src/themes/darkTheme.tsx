import { deepPurple, green, grey, orange, red } from "@mui/material/colors";
import {
  ThemeOptions,
  createTheme,
} from "@mui/material/styles";

declare module "@mui/material/styles/createPalette" {
  interface TypeBackground {
    list: string;
  }
}

const themeOptions: ThemeOptions = {
  palette: {
    mode: "dark",
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
      main: grey[700] + "55",
      contrastText: "#000",
    },
    isToday: {
      main: "#4285F4",
      dark: "#4285F4",
      contrastText: "white",
    },
    isWeekend: {
      main: grey[800],
      contrastText: "white",
    },
    isWeekday: {
      main: grey[900] + "85",
      contrastText: "white",
    },
    calendarControls: {
      main: "#202124",
      contrastText: "#000",
    },
    brandColor: {
      main: "#4285F4",
      light: "#8AB4F8",
      contrastText: "#ffffff",
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

const darkTheme = createTheme(themeOptions);

export default darkTheme;
