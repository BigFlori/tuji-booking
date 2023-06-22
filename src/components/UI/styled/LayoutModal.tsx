import { styled } from "@mui/material";
import { Modal, ModalProps } from "@mui/material";

//Rendelkeznie kell egy modal-content gyerekkel
const LayoutModal = styled(Modal)<ModalProps>(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "& .modal-container": {
    backgroundColor: "white",
    borderRadius: 5,
    width: "90%",
    maxWidth: theme.breakpoints.values.lg,
    paddingInline: theme.spacing(2),
    paddingBlock: theme.spacing(3),
    [theme.breakpoints.up("sm")]: {
      width: "80%",
    },
  },
  "& .modal-header": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing(2),
  },
}));

export default LayoutModal;
