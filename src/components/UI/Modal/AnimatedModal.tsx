import { Box, Fade, Slide, Theme, useMediaQuery } from "@mui/material";
import LayoutModal from "../styled/LayoutModal";


type AnimatedModalProps = {
  children?: React.ReactNode;
  open: boolean;
  onClose: () => void;
};

const AnimatedModal: React.FC<AnimatedModalProps> = (props: AnimatedModalProps) => {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

  const modalContent = (
    <Box className="modal-container">
      {props.children}
    </Box>
  );

  return (
    <LayoutModal
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
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

export default AnimatedModal;
