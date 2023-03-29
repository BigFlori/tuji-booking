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
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#f50057",
    },
    background: {
      paper: "#1a1a1a",
      list: "#272727",
    },
  },
};

const darkTheme = createTheme(themeOptions);

export default darkTheme;
