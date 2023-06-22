import { styled } from "@mui/material";
import { Modal, ModalProps } from "@mui/material";

const FullScreenModal = styled(Modal)<ModalProps>(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "& .modal-content": {
    backgroundColor: "white",
    width: "90%",
    height: "90%",
    [theme.breakpoints.up("sm")]: {
      width: "80%",
    },
    [theme.breakpoints.up("md")]: {
        width: "60%",
    },
    [theme.breakpoints.up("lg")]: {
        width: "40%",
    },
    [theme.breakpoints.up("xl")]: {
        width: "30%",
    },
  },
}));

export default FullScreenModal;
