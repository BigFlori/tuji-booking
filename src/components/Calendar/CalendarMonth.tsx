import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import dayjs from "dayjs";
import CalendarDay from "./CalendarDay";
import { useMemo, useContext } from "react";
import { GroupContext } from "@/store/group-context";
import CalendarGroup from "./Group/CalendarGroup";
import "intersection-observer";

interface ICalendarMonthProps {
  month: number;
  year: number;
  today: number;
  monthRef: React.RefObject<HTMLDivElement>;
};

//Egy teljes hónapot renderel, a napokat és a csoportokat beleértve a csoportok sorait és celláit
const CalendarMonth: React.FC<ICalendarMonthProps> = (props: ICalendarMonthProps) => {
  const groupCtx = useContext(GroupContext);

  const monthDate = useMemo(() => {
    return dayjs().locale("hu-hu").year(props.year).month(props.month);
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
      days.push(<CalendarDay key={day.toString()} date={day} isLast={i === dates.length - 1} />);
    }
    return days;
  }, [monthDate]);

  //Csoportok generálása
  const generateGroups = useMemo(() => {
    const groups = [];
    for (let i = 0; i < groupCtx.groups.length; i++) {
      const group = groupCtx.groups[i];
      groups.push(
        <CalendarGroup
          key={group.id}
          groupId={group.id}
          monthDate={monthDate}
          isLastGroup={i === groupCtx.groups.length - 1}
        />
      );
    }
    return groups;
  }, [groupCtx.groups, monthDate, groupCtx.isLoading]);

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column" }}
      id={props.month.toString()}
      ref={props.monthRef}
    >
      <Paper sx={{ display: "flex", zIndex: 1 }} elevation={6}>
        {generateDays}
      </Paper>
      {generateGroups}
    </Box>
  );
};

export default CalendarMonth;
