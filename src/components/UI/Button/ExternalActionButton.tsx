import CallIcon from "@mui/icons-material/Call";
import EmailIcon from "@mui/icons-material/Email";
import SmsIcon from "@mui/icons-material/Sms";
import { IconButton, Tooltip } from "@mui/material";

interface ExternalActionButtonProps {
  type: "mailto" | "tel" | "sms";
  value?: string;
}

// Komponens, amely lehetővé teszi a felhasználó számára, hogy külső alkalmazásokat indítson (telefon, SMS, e-mail)
const ExternalActionButton: React.FC<ExternalActionButtonProps> = ({ type, value }) => {
  const handleOnClick = () => {
    if (value) {
      window.open(`${type}:${value}`);
    }
  };

  const icon = () => {
    switch (type) {
      case "tel":
        return <CallIcon />;
      case "sms":
        return <SmsIcon />;
      case "mailto":
        return <EmailIcon />;
      default:
        return <CallIcon />;
    }
  };

  return (
    <Tooltip title={type === "tel" ? "Hívás" : type === "sms" ? "SMS küldés" : "E-mail küldés"}>
      <IconButton onClick={handleOnClick} aria-label={`${type}-client-button`}>
        {icon()}
      </IconButton>
    </Tooltip>
  );
};

export default ExternalActionButton;
