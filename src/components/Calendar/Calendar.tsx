import { useContext, useMemo } from "react";
import { Box } from "@mui/material";
import CalendarGroupHeader from "../UI/CalendarGroupHeader";
import CalendarMonth from "./CalendarMonth";
import { GroupsContext } from "@/store/groups-context";

const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

const Calendar: React.FC<{}> = () => {
  const groupCtx = useContext(GroupsContext);

  const generateGroupHeaders = useMemo(() => {
    const headers = [];
    for (let i = 0; i < groupCtx.groups.length; i++) {
      const group = groupCtx.groups[i];
      headers.push(
        <CalendarGroupHeader
          key={group.id}
          group={group}
          isLast={i === groupCtx.groups.length - 1}
        />
      );
    }
    return headers;
  }, [groupCtx.groups]);

  return (
    <Box sx={{ display: "flex", margin: 2 }}>
      <Box>
        <CalendarGroupHeader />
        {generateGroupHeaders}
      </Box>
      <Box sx={{ display: "flex", gap: 2, overflowX: "auto" }}>
        {months.map((month) => {
          return <CalendarMonth key={month} month={month} year={2023} />;
        })}
      </Box>
    </Box>
  );
};

export default Calendar;
