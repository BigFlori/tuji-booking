import { Button, ButtonProps, styled } from "@mui/material";
import { grey } from "@mui/material/colors";

const YearSelectorButton = styled(Button)<ButtonProps>(({theme}) => ({
  color: grey[700],
  fontSize: "18px",
  backgroundColor: grey[300],
  minWidth: "auto",
  '&:hover': {
    backgroundColor: grey[400],
  },
}));

export default YearSelectorButton;
