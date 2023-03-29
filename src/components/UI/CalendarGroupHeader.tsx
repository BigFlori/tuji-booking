import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Group from "@/models/group-model";

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
        height: "55px",
        minWidth: "100px",
      })}
    >
      <Typography variant='h6' fontWeight={"bold"}>
        {props.group?.title}
      </Typography>
    </Box>
  );
};

export default CalendarGroupHeader;
