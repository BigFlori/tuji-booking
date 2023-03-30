import React from "react";
import { useContext, useMemo, useState, useEffect } from "react";
import { Box } from "@mui/material";
import CalendarGroupHeader from "../UI/CalendarGroupHeader";
import CalendarMonth from "./CalendarMonth";
import { GroupsContext } from "@/store/groups-context";
import CalendarControls from "./CalendarControls";

const months = Array.from(Array(12).keys());

const Calendar: React.FC<{}> = () => {
  const [year, setYear] = useState(new Date().getFullYear());

  const increaseYear = () => setYear((prevYear) => prevYear + 1);
  const decreaseYear = () => setYear((prevYear) => prevYear - 1);

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

  const monthRefs = useMemo(() => {
    const refs = [];
    for (let i = 0; i < months.length; i++) {
      const ref = React.createRef<HTMLDivElement>();
      refs.push(ref);
    }
    return refs;
  }, []);


  const [scrolledMonth, setScrolledMonth] = useState(new Date().getMonth());

  const handleScroll = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const scrollPosition = event.currentTarget.scrollLeft;
    let i = 0;
    let acc = 0;
    while (i < monthRefs.length && acc + monthRefs[i].current!.offsetWidth < scrollPosition) {
      acc += monthRefs[i].current!.offsetWidth;
      i++;
    }
    setScrolledMonth(i);
  };

  return (
    <Box>
      <CalendarControls
        increaseYear={increaseYear}
        decreaseYear={decreaseYear}
        activeMonth={scrolledMonth}
        year={year}
      />
      <Box sx={{ display: "flex", marginTop: 1 }}>
        <Box>
          <CalendarGroupHeader />
          {generateGroupHeaders}
        </Box>
        <Box
          sx={{ display: "flex", gap: 2, overflowX: "scroll" }}
          onScroll={handleScroll}
        >
          {months.map((month, index) => {
            return <CalendarMonth key={month} month={month} year={year} monthRef={monthRefs[index]} />;
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default Calendar;
