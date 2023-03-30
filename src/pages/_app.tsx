import type { AppProps } from "next/app";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { CssBaseline, useMediaQuery } from "@mui/material";
import { lightTheme } from "@/themes/lightTheme";
import darkTheme from "@/themes/darkTheme";
import { ThemeProvider } from "@mui/material/styles";
import { useMemo } from "react";
import "../styles/globals.css";
import { useRouter } from "next/router";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/hu";
import PageTransition from "@/components/UI/PageTransition";
import GroupsContextProvider from "@/store/groups-context";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = useMemo(
    () => (prefersDarkMode ? darkTheme : lightTheme),
    [prefersDarkMode]
  );

  dayjs.locale("hu-hu");

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <PageTransition path={router.route}>
          <GroupsContextProvider>
            <Component {...pageProps} key={router.route} />
          </GroupsContextProvider>
        </PageTransition>
      </ThemeProvider>
    </LocalizationProvider>
  );
}
