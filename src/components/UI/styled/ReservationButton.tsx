import { styled } from "@mui/material/styles";
import { Button, ButtonProps } from "@mui/material";
import { red } from "@mui/material/colors";

const ReservationButton = styled(Button)<ButtonProps>(({ theme }) => ({
  background: red[400],
  position: "absolute",
  height: "60%",
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 5,
  borderRadius: 6,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  paddingLeft: 1,
  fontWeight: "bold",
  fontFamily: "Roboto",
  textTransform: "none",
  color: theme.palette.getContrastText(red[300]),
  outline: "none",
  minWidth: 0,
  fontSize: 15,
  boxShadow: theme.shadows[4],
  "&:hover": {
    background: red[500],
  },
}));

export default ReservationButton;
