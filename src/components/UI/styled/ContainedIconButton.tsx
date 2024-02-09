import { ButtonProps, IconButton, styled } from "@mui/material";
import { darken } from "@mui/material";

interface IContainedIconButtonProps extends ButtonProps {
  iconColor?: string;
  backgroundColor?: string;
}

const ContainedIconButton = styled(IconButton)<IContainedIconButtonProps>(({ theme, backgroundColor, iconColor }) => ({
  backgroundColor: backgroundColor ? backgroundColor : theme.palette.grey[300],
  color: iconColor ? iconColor : theme.palette.getContrastText(theme.palette.grey[300]),
  "&:hover": {
    backgroundColor: backgroundColor ? darken(backgroundColor, 0.2) : theme.palette.grey[300],
  },
}));

// export default ContainedIconButton;
