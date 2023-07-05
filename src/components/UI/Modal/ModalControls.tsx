import { Box, Button, IconButton, Theme, Typography, useMediaQuery } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

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
  return (
    <>
      <Box component="header" className="modal-header">
        <Typography variant="body1" fontWeight="500">
          {props.title}
        </Typography>
        <Box sx={{ display: "flex", gap: { xs: 1, sm: 2 } }}>
          {props.isEdit && (
            <IconButton color="error" size="small" onClick={props.onDelete}>
              <DeleteIcon />
            </IconButton>
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
