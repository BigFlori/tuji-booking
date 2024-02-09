import { Button, ButtonProps, lighten, styled } from "@mui/material";
import { grey } from "@mui/material/colors";

const YearSelectorButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: grey[700],
  fontSize: "18px",
  backgroundColor: theme.palette.mode === "light" ? grey[400] : lighten(theme.palette.calendarControls.main, 0.2),
  minWidth: "auto",
  "&:hover": {
    backgroundColor: grey[400],
  },
}));

export default YearSelectorButton;
