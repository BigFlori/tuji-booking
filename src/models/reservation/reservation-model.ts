import dayjs from "dayjs";
import PaymentState from "./payment-state-model";
import Client from "../client-model";

interface Reservation {
    id: number;
    groupId: number;
    startDate: dayjs.Dayjs;
    endDate: dayjs.Dayjs;
    paymentState: PaymentState;
    paymentDate?: dayjs.Dayjs;
    fullPrice: number;
    depositPrice: number;
    comment?: string;
    client?: Client;
}

export default Reservation;