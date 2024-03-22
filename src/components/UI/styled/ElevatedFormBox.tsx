import { Box, BoxProps, lighten, styled } from "@mui/material";

interface IElevatedFormBoxProps extends BoxProps {
  autoComplete?: "on" | "off";
  noValidate?: boolean;
}

const ElevatedFormBox = styled(Box)<IElevatedFormBoxProps>(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "light" ? theme.palette.background.paper : lighten(theme.palette.background.default, 0.025),
  borderRadius: 5,
  maxWidth: theme.breakpoints.values.sm,
  paddingInline: theme.spacing(5),
  paddingBlock: theme.spacing(3),
  boxShadow: theme.shadows[5],
  width: "80%",
  height: "fit-content",
  minHeight: "fit-content",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 12,
  [theme.breakpoints.down("md")]: {
    width: "95%",
  },
}));

export default ElevatedFormBox;
