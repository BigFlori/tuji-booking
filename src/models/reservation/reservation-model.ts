import dayjs from "dayjs";
import PaymentState from "./payment-state-model";

interface Reservation {
    id: string;
    groupId: string;
    clientId?: string;
    startDate: dayjs.Dayjs;
    endDate: dayjs.Dayjs;
    paymentState: PaymentState;
    paymentDate?: dayjs.Dayjs;
    fullPrice: number;
    depositPrice: number;
    comment?: string;
}

export default Reservation;