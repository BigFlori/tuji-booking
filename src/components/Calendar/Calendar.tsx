import React from "react";
import { useMemo, useState } from "react";
import { Box } from "@mui/material";
import CalendarGroupHeader from "./Group/CalendarGroupHeader";
import CalendarMonth from "./CalendarMonth";
import { useGroupContext } from "@/store/group-context";
import CalendarControls from "./Controls/CalendarControls";
import dayjs from "dayjs";
import { CALENDAR_MONTH_GAP } from "@/utils/config";
import CalendarGroupHeaderController from "./Group/CalendarGroupHeaderController";
import NewGroup from "./Controls/NewGroup";
import { useReservationContext } from "@/store/reservation-context";
import { useClientContext } from "@/store/client-context";

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

  const groupCtx = useGroupContext();

  //Csoport fejlécek generálása
  const generateGroupHeaders = useMemo(() => {
    const headers: JSX.Element[] = [];
    groupCtx.groups.forEach((group) => {
      headers.push(<CalendarGroupHeader key={group.id} group={group} isExpanded={isGroupExpanded} />);
    });

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
  const [scrollLeftPosition, setScrollLeftPosition] = useState(0);
  const reservationCtx = useReservationContext();
  const clientCtx = useClientContext();
  // const isLoading = reservationCtx.isFetching || clientCtx.isFetching;

  const handleScroll = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const scrollPosition = event.currentTarget.scrollLeft;
    setScrollLeftPosition(scrollPosition);
    let i = 0;
    let acc = 0;
    while (
      i < monthRefs.length &&
      acc + monthRefs[i].current!.offsetWidth + (CALENDAR_MONTH_GAP - 1) < scrollPosition
    ) {
      acc += monthRefs[i].current!.offsetWidth + (CALENDAR_MONTH_GAP - 1);
      i++;
    }
    setScrolledMonth(i);

    const scrolledMonth = dayjs().year(year).month(i).startOf("month");
    reservationCtx.setFetchStartDate(scrolledMonth.subtract(2, "month"));
  };

  const disableScroll = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
    event.currentTarget.scrollTo(scrollLeftPosition, 0);
  };

  return (
    <>
      <CalendarControls
        increaseYear={increaseYear}
        decreaseYear={decreaseYear}
        activeMonth={scrolledMonth}
        year={year}
      />
      <Box sx={{ display: "flex" }}>
        <Box>
          <CalendarGroupHeaderController isExpanded={isGroupExpanded} toggleIsExpanded={toggleGroupExpand} />
          {generateGroupHeaders}
          <Box sx={{ position: "absolute" }}>
            <NewGroup isExpanded={isGroupExpanded} />
          </Box>
        </Box>
        <Box
          sx={{ display: "flex", gap: `${CALENDAR_MONTH_GAP}px`, overflowX: "scroll" }}
          // onScroll={isLoading ? disableScroll : handleScroll}
        >
          {months.map((month, index) => {
            return <CalendarMonth key={month} month={month} today={today} year={year} monthRef={monthRefs[index]} />;
          })}
        </Box>
      </Box>
    </>
  );
};

export default Calendar;
