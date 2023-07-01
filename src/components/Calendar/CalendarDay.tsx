import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import CalendarItemContainer from "./CalendarItemContainer";
import { CALENDAR_HEADER_DAY_NAME_FONTSIZE, CALENDAR_HEADER_DAY_NUMBER_FONTSIZE } from "@/config/config";

type CalendarDayProps = {
  date: dayjs.Dayjs;
  isLast?: boolean;
};

const CalendarDay: React.FC<CalendarDayProps> = (props: CalendarDayProps) => {
  const formattedDateName = props.date.format("ddd");
  const formattedDateDay = props.date.format("DD");

  return (
    <CalendarItemContainer
      isLast={props.isLast}
      date={props.date}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
      isDayRow
    >
      <Typography fontSize={CALENDAR_HEADER_DAY_NAME_FONTSIZE}>{formattedDateName}</Typography>
      <Typography variant='h6' fontWeight={500} fontSize={CALENDAR_HEADER_DAY_NUMBER_FONTSIZE}>
        {formattedDateDay}
      </Typography>
    </CalendarItemContainer>
  );
};
export default CalendarDay;
