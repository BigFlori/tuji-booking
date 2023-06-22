import { Box, Button, IconButton, Typography } from "@mui/material";
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
  return (
    <LayoutModal open={props.open} onClose={props.onClose}>
      <Box className="modal-container" sx={{maxWidth: '500px !important'}}>
        <Box component="header" className="modal-header">
          <Typography variant="body1" fontWeight="500">
            {props.title}
          </Typography>
          <Box sx={{ display: "flex", gap: {xs: 1, sm: 2} }}>
            <IconButton color="error" size="small">
                <DeleteIcon />
            </IconButton>
            <Button variant="contained" startIcon={<SaveIcon />} size="small" onClick={props.onSave}>
              Mentés
            </Button>
            <IconButton onClick={props.onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
        {props.children}
      </Box>
    </LayoutModal>
  );
};

export default EditorModal;
