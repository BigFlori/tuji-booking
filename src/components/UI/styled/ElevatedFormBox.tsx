import { Box, BoxProps, styled } from "@mui/material";

interface IElevatedFormBoxProps extends BoxProps {
    autoComplete?: "on" | "off";
    noValidate?: boolean;
}

const ElevatedFormBox = styled(Box)<IElevatedFormBoxProps>(({ theme }) => ({
  backgroundColor: "white",
  borderRadius: 5,
  width: "100%",
  height: "100%",
  maxHeight: "100%",
  overflow: "auto",
  maxWidth: theme.breakpoints.values.sm,
  paddingInline: theme.spacing(2),
  paddingBlock: theme.spacing(3),
  boxShadow: theme.shadows[5],
  [theme.breakpoints.up("sm")]: {
    width: "80%",
    height: "auto",
    maxHeight: "80%",
    overflow: "auto",
  },
}));

export default ElevatedFormBox;
