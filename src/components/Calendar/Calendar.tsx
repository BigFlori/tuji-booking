import { useContext, useMemo, useState, useRef, useEffect } from "react";
import { Box } from "@mui/material";
import CalendarGroupHeader from "../UI/CalendarGroupHeader";
import CalendarMonth from "./CalendarMonth";
import { GroupsContext } from "@/store/groups-context";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { ArrowForwardIos, ArrowBackIosNew } from "@mui/icons-material";
import dayjs from "dayjs";
import Button from "@mui/material/Button";

const months = Array.from(Array(12).keys());
const monthNames = months.map((month) => dayjs().month(month).format("MMM"));

const Calendar: React.FC<{}> = () => {
  const [year, setYear] = useState(new Date().getFullYear());

  const increaseYear = (event: React.MouseEvent<HTMLElement>) => {
    setYear((prevYear) => prevYear + 1);
  };

  const decreaseYear = (event: React.MouseEvent<HTMLElement>) => {
    setYear((prevYear) => prevYear - 1);
  };

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
    <Box>
      <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
        <Typography variant='h4'>Naptár</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton onClick={decreaseYear}>
            <ArrowBackIosNew />
          </IconButton>
          <Typography variant='h5'>{year}</Typography>
          <IconButton onClick={increaseYear}>
            <ArrowForwardIos />
          </IconButton>
        </Box>
        {/* <Box sx={{ display: "flex", gap: 1 }}>
          {monthNames.map((monthName) => {
            return <Button key={monthName}>{monthName}</Button>;
          })}
        </Box> */}
      </Box>
      <Box sx={{ display: "flex", marginTop: 1 }}>
        <Box>
          <CalendarGroupHeader />
          {generateGroupHeaders}
        </Box>
        <Box sx={{ display: "flex", gap: 2, overflowX: "auto" }}>
          {months.map((month) => {
            return <CalendarMonth key={month} month={month} year={year} />;
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default Calendar;
