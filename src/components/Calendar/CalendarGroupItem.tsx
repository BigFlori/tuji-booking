import Box from "@mui/material/Box";
import dayjs from "dayjs";
import CalendarItemContainer from "../UI/CalendarItemContainer";

type CalendarGroupProps = {
  children?: React.ReactNode;
  date: dayjs.Dayjs;
  isLast?: boolean;
  isLastGroup?: boolean;
};

const CalendarGroupItem: React.FC<CalendarGroupProps> = (
  props: CalendarGroupProps
) => {
  return (
    <CalendarItemContainer
      date={props.date}
      isLast={props.isLast}
      isLastGroup={props.isLastGroup}
    >
      {props.children}
    </CalendarItemContainer>
  );
};

export default CalendarGroupItem;
