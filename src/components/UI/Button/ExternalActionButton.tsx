import CallIcon from "@mui/icons-material/Call";
import EmailIcon from "@mui/icons-material/Email";
import { IconButton } from "@mui/material";

interface ExternalActionButtonProps {
  type: "mailto" | "tel";
  value?: string;
}

const ExternalActionButton: React.FC<ExternalActionButtonProps> = ({type, value}) => {
  const handleOnClick = () => {
    if (value) {
      window.open(`${type}:${value}`);
    }
  };

  return (
    <IconButton onClick={handleOnClick} aria-label={`${type}-client-button`}>
      {type === "tel" ? <CallIcon /> : <EmailIcon />}
    </IconButton>
  );
};

export default ExternalActionButton;
