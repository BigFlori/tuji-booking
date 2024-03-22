import dayjs from "dayjs";
import PaymentState from "./payment-state-model";

interface Reservation {
    id: string;
    groupId: string;
    clientId?: string;
    startDate: dayjs.Dayjs;
    startTime?: dayjs.Dayjs;
    endDate: dayjs.Dayjs;
    endTime?: dayjs.Dayjs;
    paymentState: PaymentState;
    fullPrice: number;
    depositPrice: number;
    cautionPrice: number;
    cautionReturned: boolean;
    expenses: number;
    comment?: string;
}

export default Reservation;