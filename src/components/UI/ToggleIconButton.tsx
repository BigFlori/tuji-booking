import { IconButton } from "@mui/material";

interface IToggleIconButtonProps {
  onIcon: React.ReactNode;
  offIcon: React.ReactNode;
  onToggle: () => void;
  state: boolean;
}

const ToggleIconButton: React.FC<IToggleIconButtonProps> = ({ onIcon, offIcon, onToggle, state, ...rest }) => {
  return (
    <IconButton onClick={onToggle} {...rest}>
      {state ? onIcon : offIcon}
    </IconButton>
  );
};

export default ToggleIconButton;
