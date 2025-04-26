import { Box } from "@mui/system";
import YearSelector from "./YearSelector";
import MonthSelector from "./MonthSelector";
import NewReservation from "./NewReservation";

interface ICalendarControlsProps {
  year: number;
  activeMonth: number;
  increaseYear: () => void;
  decreaseYear: () => void;
}

const CalendarControls: React.FC<ICalendarControlsProps> = (props: ICalendarControlsProps) => {

  const jumpToId = (id: string) => {
    const monthElement = document.getElementById(id);
    if (monthElement) {
      monthElement.scrollIntoView({
        behavior: "auto",
        block: "start",
        inline: "start",
      });
    }
  };

  const nextYear = () => {
    props.increaseYear();
    jumpToId("0");
  };

  const prevYear = () => {
    props.decreaseYear();
    jumpToId("11");
  };

  return (
    <Box
      sx={(theme) => ({
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "space-between",
        background: theme.palette.calendarControls.main,
        padding: 1,
        paddingInline: 2,
        width: "100%",
        gap: 1,
      })}
    >
      <Box
        sx={{
          display: "flex",
          gap: 2,
        }}
      >
        <YearSelector year={props.year} onNextYear={nextYear} onPreviousYear={prevYear} />
        <MonthSelector activeMonth={props.activeMonth} jumpToId={jumpToId} />
      </Box>
      <Box>
        <NewReservation />
      </Box>
    </Box>
  );
};

export default CalendarControls;
