import { CALENDAR_ITEM_HEIGHT } from "@/config/config";
import { styled } from "@mui/material";
import { Button, ButtonProps } from "@mui/material";

const GroupHeaderButton = styled(Button)<ButtonProps>(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  height: CALENDAR_ITEM_HEIGHT,
  border: "1px solid" + theme.palette.grey[300],
  textTransform: "none",
  color: theme.palette.getContrastText(theme.palette.grey[300]),
  borderRadius: 0,
  padding: 0,
  backgroundColor: "#fff",
  "&:hover": {
    backgroundColor: theme.palette.grey[100],
  },
}));

export default GroupHeaderButton;
