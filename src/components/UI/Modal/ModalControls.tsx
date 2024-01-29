import { Box, Button, Dialog, DialogActions, DialogTitle, IconButton, Theme, Typography, useMediaQuery } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";

interface ModalControlsProps {
  children?: React.ReactNode;
  title: string;
  onClose: () => void;
  isEdit?: boolean;
  onDelete?: () => void;
  saveButtonProps?: {
    type?: "submit" | "button";
    onClick?: () => void;
  };
}

const ModalControls: React.FC<ModalControlsProps> = (props) => {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
  const [openDialog, setOpenDialog] = useState(false);

  const handleDelete = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleDialogDelete = () => {
    setOpenDialog(false);
    props.onDelete && props.onDelete();
  };

  return (
    <>
      <Box component="header" className="modal-header">
        <Typography variant="body1" fontWeight="500">
          {props.title}
        </Typography>
        <Box sx={{ display: "flex", gap: { xs: 1, sm: 2 } }}>
          {props.isEdit && (
            <>
              <IconButton color="error" size="small" onClick={handleDelete}>
                <DeleteIcon />
              </IconButton>
              <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>Biztosan törölni szeretnéd a foglalást?</DialogTitle>
                <DialogActions>
                  <Button onClick={handleDialogClose}>Mégse</Button>
                  <Button onClick={handleDialogDelete} color="error">
                    Törlés
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          )}
          {isMobile ? (
            <IconButton size="small" color="success" {...props.saveButtonProps}>
              <SaveIcon />
            </IconButton>
          ) : (
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              size="small"
              color="success"
              {...props.saveButtonProps}
            >
              Mentés
            </Button>
          )}
          <IconButton onClick={props.onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>
      <Box component="main">{props.children}</Box>
      {isMobile && (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2, marginTop: 4 }}>
          <Button variant="outlined" onClick={props.onClose} color="error" fullWidth>
            Bezár
          </Button>
          <Button variant="contained" startIcon={<SaveIcon />} color="success" fullWidth {...props.saveButtonProps}>
            Mentés
          </Button>
        </Box>
      )}
    </>
  );
};

export default ModalControls;
