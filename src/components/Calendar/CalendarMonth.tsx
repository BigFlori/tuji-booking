import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import CalendarDay from "./CalendarDay";
import { useMemo, useContext } from "react";
import { GroupsContext } from "@/store/groups-context";
import CalendarGroup from "./CalendarGroup";

type CalendarMonthProps = {
  month: number;
  year: number;
};

const CalendarMonth: React.FC<CalendarMonthProps> = (
  props: CalendarMonthProps
) => {
  const groupCtx = useContext(GroupsContext);
  const monthDate = useMemo(() => {
    return dayjs().year(props.year).month(props.month);
  }, [props.month, props.year]);

  //Dátumok generálása
  const generateDays = useMemo(() => {
    const dates = [];
    const daysInMonth = monthDate.daysInMonth();
    for (let i = 1; i <= daysInMonth; i++) {
      const date = monthDate.date(i);
      dates.push(date);
    }

    const days = [];
    for (let i = 0; i < dates.length; i++) {
      const day = dates[i];
      days.push(
        <CalendarDay
          key={day.toString()}
          date={day}
          isLast={i === dates.length - 1}
        />
      );
    }
    return days;
  }, [props.month, props.year]);

  //Csoportok generálása
  const generateGroups = useMemo(() => {
    const groups = [];
    for (let i = 0; i < groupCtx.groups.length; i++) {
      const group = groupCtx.groups[i];
      groups.push(<CalendarGroup key={group.id} monthDate={monthDate} isLastGroup={i === groupCtx.groups.length - 1} />);
    }
    return groups;
  }, [groupCtx.groups]);

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column" }}
      id={props.month.toString()}
    >
      <Paper sx={{ display: "flex", zIndex: 1 }} elevation={6}>
        {generateDays}
      </Paper>
      {generateGroups}
    </Box>
  );
};

export default CalendarMonth;
