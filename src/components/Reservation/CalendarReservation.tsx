import Reservation from "@/models/reservation-model";
import dayjs from "dayjs";

type CalendarReserverationProps = {
    reservation: Reservation;
    renderingDate: dayjs.Dayjs;
}

const CalendarReservation: React.FC<CalendarReserverationProps> = (props: CalendarReserverationProps) => {
    return (
        <div>
            <h1>Reservation</h1>
        </div>
    );
};

export default CalendarReservation;