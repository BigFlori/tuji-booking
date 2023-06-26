import CallIcon from "@mui/icons-material/Call";
import EmailIcon from "@mui/icons-material/Email";
import { IconButton } from "@mui/material";

interface ExternalActionButtonProps {
  type: "mailto" | "tel";
  value?: string;
}

const ExternalActionButton: React.FC<ExternalActionButtonProps> = (props) => {
  const handleOnClick = () => {
    if (props.value) {
      window.open(`${props.type}:${props.value}`);
    }
  };

  return (
    <IconButton onClick={handleOnClick} aria-label="call-client-button">
      {props.type === "tel" ? <CallIcon /> : <EmailIcon />}
    </IconButton>
  );
};

export default ExternalActionButton;
