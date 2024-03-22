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
import { huHU } from "@mui/x-date-pickers";
import { UserContextProvider } from "@/store/user-context";
import NextNProgress from "nextjs-progressbar";
import { QueryClient, QueryClientProvider } from "react-query";
import ThemeChanger from "@/store/theme-context";
import { SnackbarProvider } from "notistack";

const queryClient = new QueryClient();

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
      <ThemeChanger>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <UserContextProvider>
            <NextNProgress
              color="#fff"
              height={3}
              startPosition={0.3}
              stopDelayMs={200}
              showOnShallow={false}
              options={{ showSpinner: false }}
            />
            <SnackbarProvider maxSnack={3} autoHideDuration={3000} SnackbarProps={{ style: { cursor: "pointer" } }}>
              <Component {...pageProps} key={router.route} />
            </SnackbarProvider>
          </UserContextProvider>
        </QueryClientProvider>
      </ThemeChanger>
    </LocalizationProvider>
  );
}
