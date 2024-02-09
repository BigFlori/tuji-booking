import { CALENDAR_ITEM_HEIGHT } from "@/utils/config";
import { styled } from "@mui/material";
import { Button, ButtonProps } from "@mui/material";

const GroupHeaderButton = styled(Button)<ButtonProps>(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  height: CALENDAR_ITEM_HEIGHT,
  border: "1px solid" + theme.palette.calendarBorder.main,
  textTransform: "none",
  color: theme.palette.isWeekday.contrastText,
  borderRadius: 0,
  padding: 0,
  backgroundColor: theme.palette.isWeekday.main,
  "&:hover": {
    backgroundColor: theme.palette.isWeekday.main,
  },
}));

export default GroupHeaderButton;
