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
import "dayjs/locale/hu";
import GroupContextProvider from "@/store/group-context";
import ReservationContextProvider from "@/store/reservation-context";
import { huHU } from "@mui/x-date-pickers";
import ClientContextProvider from "@/store/client-context";
import { UserContextProvider } from "@/store/user-context";
import NextTopLoader from "nextjs-toploader";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = useMemo(() => (prefersDarkMode ? darkTheme : lightTheme), [prefersDarkMode]);

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale="hu"
      localeText={huHU.components.MuiLocalizationProvider.defaultProps.localeText}
    >
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <UserContextProvider>
          <GroupContextProvider>
            <ReservationContextProvider>
              <ClientContextProvider>
                <NextTopLoader
                  color="#FFFFFF"
                  initialPosition={0.08}
                  crawlSpeed={200}
                  height={3}
                  crawl={true}
                  showSpinner={false}
                  easing="ease"
                  speed={200}
                  shadow="0 0 10px #2299DD,0 0 5px #2299DD"
                />
                <Component {...pageProps} key={router.route} />
              </ClientContextProvider>
            </ReservationContextProvider>
          </GroupContextProvider>
        </UserContextProvider>
      </ThemeProvider>
    </LocalizationProvider>
  );
}
