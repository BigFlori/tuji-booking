import { Box, Button, Fade, IconButton, Slide, Theme, Typography, useMediaQuery } from "@mui/material";
import LayoutModal from "./styled/LayoutModal";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

type EditorModalProps = {
  children?: React.ReactNode;
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  title: string;
};

const EditorModal: React.FC<EditorModalProps> = (props: EditorModalProps) => {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

  const modalContent = (
    <Box className="modal-container">
      <Box component="header" className="modal-header">
        <Typography variant="body1" fontWeight="500">
          {props.title}
        </Typography>
        <Box sx={{ display: "flex", gap: { xs: 1, sm: 2 } }}>
          <IconButton color="error" size="small">
            <DeleteIcon />
          </IconButton>
          {isMobile ? (
            <IconButton onClick={props.onSave} size="small" color="success">
              <SaveIcon />
            </IconButton>
          ) : (
            <Button variant="contained" startIcon={<SaveIcon />} size="small" onClick={props.onSave} color="success">
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
          <Button variant="contained" startIcon={<SaveIcon />} onClick={props.onSave} color="success" fullWidth>
            Mentés
          </Button>
        </Box>
      )}
    </Box>
  );

  return (
    <LayoutModal
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="editor-modal-title"
      aria-describedby="editor-modal-description"
      closeAfterTransition
    >
      {isMobile ? (
        <Slide in={props.open} direction="left" mountOnEnter unmountOnExit>
          {modalContent}
        </Slide>
      ) : (
        <Fade in={props.open}>{modalContent}</Fade>
      )}
    </LayoutModal>
  );
};

export default EditorModal;
