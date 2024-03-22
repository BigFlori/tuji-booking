import { Typography, TypographyProps, styled } from "@mui/material";

const TextButton = styled(Typography)<TypographyProps>(({ theme }) => ({
  display: "inline-block",
  padding: theme.spacing(1, 2),
  borderRadius: "12px",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  textDecoration: "none",
  transition: "background-color 0.3s ease",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

export default TextButton;
