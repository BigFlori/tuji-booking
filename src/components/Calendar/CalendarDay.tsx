import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import CalendarItemContainer from "../UI/CalendarItemContainer";

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
      <Typography>{formattedDateName}</Typography>
      <Typography variant='h6' fontWeight={"bold"}>
        {formattedDateDay}
      </Typography>
    </CalendarItemContainer>
  );
};
export default CalendarDay;
