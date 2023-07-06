import { Box, BoxProps, styled } from "@mui/material";

interface IElevatedFormBoxProps extends BoxProps {
    autoComplete?: "on" | "off";
    noValidate?: boolean;
}

const ElevatedFormBox = styled(Box)<IElevatedFormBoxProps>(({ theme }) => ({
  backgroundColor: "white",
  borderRadius: 5,
  maxWidth: theme.breakpoints.values.sm,
  paddingInline: theme.spacing(5),
  paddingBlock: theme.spacing(3),
  boxShadow: theme.shadows[5],
  width: "80%",
  height: "auto",
  maxHeight: "80%",
  [theme.breakpoints.down("md")]: {
    width: "95%",
  },
}));

export default ElevatedFormBox;
