import dayjs from "dayjs";
import PaymentStatus from "./payment-status-model";

interface Reservation {
    id: number;
    groupId: number;
    startDate: dayjs.Dayjs;
    endDate: dayjs.Dayjs;
    paymentStatus: PaymentStatus;
    paymentDate?: dayjs.Dayjs;
    fullPrice: number;
    depositPrice: number;
    comment?: string;
}

export default Reservation;