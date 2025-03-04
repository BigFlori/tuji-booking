import { SnackbarKey, closeSnackbar, enqueueSnackbar } from "notistack";

export function useSnack() {
  const showSnackbar = (msg: string, severity: "success" | "error" | "warning" | "info" = "success") => {
    const key: SnackbarKey = enqueueSnackbar(msg, {
      variant: severity,
      SnackbarProps: {
        onClick: () => closeSnackbar(key),
      },
    });
  };

  return showSnackbar;
}
