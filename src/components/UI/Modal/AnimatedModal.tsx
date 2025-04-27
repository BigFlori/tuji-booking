import { Box, Fade, Slide, Theme, useMediaQuery } from "@mui/material";
import LayoutModal from "../styled/LayoutModal";

interface IAnimatedModalProps {
  children?: React.ReactNode;
  open: boolean;
  onClose: () => void;
};

// A modal animációs komponens, amely a mobil és asztali nézetekhez különböző animációkat használ
const AnimatedModal: React.FC<IAnimatedModalProps> = (props: IAnimatedModalProps) => {
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
