import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Group from "@/models/group-model";
import { CALENDAR_GROUP_WIDTH, CALENDAR_ITEM_HEIGHT } from "@/config/config";

type CalendarGroupHeaderProps = {
  group?: Group;
  isLast?: boolean;
};

const CalendarGroupHeader: React.FC<CalendarGroupHeaderProps> = (
  props: CalendarGroupHeaderProps
) => {
  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: "1px solid" + theme.palette.grey[300],
        borderBottom: props.isLast ? "1px solid" + theme.palette.grey[300] : "none",
        height: `${CALENDAR_ITEM_HEIGHT}px`,
        minWidth: `${CALENDAR_GROUP_WIDTH}px`,
      })}
    >
      <Typography fontWeight={"bold"}>
        {props.group?.title}
      </Typography>
    </Box>
  );
};

export default CalendarGroupHeader;
