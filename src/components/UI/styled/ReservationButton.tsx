import { styled } from "@mui/material/styles";
import { Button, ButtonProps } from "@mui/material";
import { red } from "@mui/material/colors";

const ReservationButton = styled(Button)<ButtonProps>(({ theme }) => ({
  position: "absolute",
  height: "82%",
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 5,
  borderRadius: 3,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  paddingLeft: 1,
  fontWeight: "500",
  fontFamily: "Roboto",
  textTransform: "none",
  outline: "none",
  minWidth: 0,
  fontSize: '0.8em',
  padding: 0,
  lineHeight: 1.1,
  //boxShadow: theme.shadows[2],
  color: theme.palette.getContrastText(red[300]),
}));

export default ReservationButton;
