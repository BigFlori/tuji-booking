import { styled } from "@mui/material/styles";
import { Button, ButtonProps } from "@mui/material";

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
  fontWeight: "500",
  fontFamily: "Roboto",
  textTransform: "none",
  outline: "none",
  minWidth: 0,
  fontSize: '0.8em',
  padding: 0,
  paddingLeft: "13px",
  paddingRight: "8px",
  lineHeight: 1.1,
  color: theme.palette.notPaid.contrastText,
}));

export default ReservationButton;
