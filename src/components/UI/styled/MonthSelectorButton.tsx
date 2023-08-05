import { Button, ButtonProps, styled } from "@mui/material";

const MonthSelectorButton = styled(Button)<ButtonProps>(({ theme, variant }) => ({
  backgroundColor: variant === "contained" ? theme.palette.brandColor.main : "transparent",
  color: variant === "contained" ? theme.palette.brandColor.contrastText : theme.palette.brandColor.main,
  borderColor: variant === "outlined" ? theme.palette.brandColor.main : "transparent",
  maxWidth: "50px",
  minWidth: "50px",
  maxHeight: "30px",
  textTransform: "capitalize",
  '&:hover': {
    backgroundColor: variant === "contained" && theme.palette.brandColor.main,
    borderColor: variant === "outlined" && theme.palette.brandColor.main,
  },
}));

export default MonthSelectorButton;