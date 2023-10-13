import { IconButton, SxProps } from "@mui/material";

interface IToggleIconButtonProps {
  onIcon: React.ReactNode;
  offIcon: React.ReactNode;
  onToggle: () => void;
  state: boolean;
  sx?: SxProps;
}

const ToggleIconButton: React.FC<IToggleIconButtonProps> = ({ onIcon, offIcon, onToggle, state, sx, ...rest }) => {
  return (
    <IconButton onClick={onToggle} sx={sx} {...rest}>
      {state ? onIcon : offIcon}
    </IconButton>
  );
};

export default ToggleIconButton;
