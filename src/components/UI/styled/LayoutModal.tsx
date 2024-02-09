import { styled } from "@mui/material";
import { Modal, ModalProps } from "@mui/material";

//Rendelkeznie kell egy modal-content gyerekkel
const LayoutModal = styled(Modal)<ModalProps>(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "& .modal-container": {
    backgroundColor: theme.palette.background.paper,
    borderRadius: 5,
    width: "100%",
    height: "100%",
    maxHeight: "100%",
    overflow: "auto",
    maxWidth: theme.breakpoints.values.sm,
    paddingInline: theme.spacing(2),
    paddingBlock: theme.spacing(3),
    [theme.breakpoints.up("sm")]: {
      width: "80%",
      height: "auto",
      maxHeight: "80%",
      overflow: "auto",
    },
  },
  // "& .modal-content": {
  //   maxHeight: "calc(100vh - 180px)",
  //   overflowY: "auto",
  //   [theme.breakpoints.up("sm")]: {
  //     maxHeight: "calc(80vh - 120px)",
  //     overflowY: "auto",
  //   },
  // },
  "& .modal-header": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing(2),
  },
}));

export default LayoutModal;
