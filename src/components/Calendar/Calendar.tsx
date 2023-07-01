import React from "react";
import { useContext, useMemo, useState } from "react";
import { Box } from "@mui/material";
import CalendarGroupHeader from "./CalendarGroupHeader";
import CalendarMonth from "./CalendarMonth";
import { GroupContext } from "@/store/group-context";
import CalendarControls from "./CalendarControls";
import dayjs from "dayjs";
import { CALENDAR_MONTH_GAP } from "@/config/config";
import CalendarGroupHeaderController from "./CalendarGroupHeaderController";

const months = Array.from(Array(12).keys());

const Calendar: React.FC<{}> = () => {
  const [isGroupExpanded, setIsGroupExpanded] = useState(false);

  const toggleGroupExpand = () => setIsGroupExpanded((prev) => !prev);

  //Jelenlegi év
  const [year, setYear] = useState(new Date().getFullYear());
  const today = dayjs().date();

  //10 évig előre, 2000-ig hátra
  const increaseYear = () =>
    setYear((prevYear) => (prevYear < dayjs().add(10, "year").year() ? prevYear + 1 : prevYear));
  const decreaseYear = () => setYear((prevYear) => (prevYear > 2000 ? prevYear - 1 : prevYear));

  const groupCtx = useContext(GroupContext);

  //Csoport fejlécek generálása
  const generateGroupHeaders = useMemo(() => {
    const headers = [];
    for (let i = 0; i < groupCtx.groups.length; i++) {
      const group = groupCtx.groups[i];
      headers.push(
        <CalendarGroupHeader
          key={group.id}
          group={group}
          isLast={i === groupCtx.groups.length - 1}
          isExpanded={isGroupExpanded}
        />
      );
    }
    return headers;
  }, [groupCtx.groups, isGroupExpanded]);

  //Navigáló gombokhoz szükséges dolgok
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
    <Box sx={{ marginTop: 1 }}>
      <CalendarControls
        increaseYear={increaseYear}
        decreaseYear={decreaseYear}
        activeMonth={scrolledMonth}
        year={year}
      />
      <Box sx={{ display: "flex", marginTop: 1 }}>
        <Box>
          <CalendarGroupHeaderController isExpanded={isGroupExpanded} toggleIsExpanded={toggleGroupExpand} />
          {generateGroupHeaders}
        </Box>
        <Box sx={{ display: "flex", gap: `${CALENDAR_MONTH_GAP}px`, overflowX: "scroll" }} onScroll={handleScroll}>
          {months.map((month, index) => {
            return <CalendarMonth key={month} month={month} today={today} year={year} monthRef={monthRefs[index]} />;
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default Calendar;
