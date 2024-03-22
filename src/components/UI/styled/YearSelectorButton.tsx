import { Button, ButtonProps, darken, lighten, styled } from "@mui/material";
import { grey } from "@mui/material/colors";

const YearSelectorButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: theme.palette.mode === "light" ? grey[700] : theme.palette.common.white,
  fontSize: "18px",
  backgroundColor:
    theme.palette.mode === "light"
      ? darken(theme.palette.calendarControls.main, 0.15)
      : lighten(theme.palette.calendarControls.main, 0.2),
  minWidth: "auto",
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "light"
        ? darken(theme.palette.calendarControls.main, 0.25)
        : lighten(theme.palette.calendarControls.main, 0.3),
  },
}));

export default YearSelectorButton;
