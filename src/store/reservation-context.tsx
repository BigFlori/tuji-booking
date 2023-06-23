import React from "react";
import Reservation from "../models/reservation/reservation-model";
import dayjs from "dayjs";
import PaymentState from "@/models/reservation/payment-state-model";

type ReservationContextObject = {
  reservations: Reservation[];
  setReservations: (reservations: Reservation[]) => void;
  addReservation: (reservation: Reservation) => void;
  removeReservation: (id: string) => void;
  updateReservation: (id: string, reservation: Reservation) => void;
  findReservationByDate: (date: dayjs.Dayjs, groupId: string) => Reservation | null;
};

export const ReservationContext = React.createContext<ReservationContextObject>({
  reservations: [],
  setReservations: () => {},
  addReservation: () => {},
  removeReservation: () => {},
  updateReservation: () => {},
  findReservationByDate: () => null,
});

const ReservationContextProvider: React.FC<{ children: React.ReactNode }> = (props) => {
  const [reservations, setReservations] = React.useState<Reservation[]>([
    {
      id: "1",
      groupId: "1",
      clientId: "1",
      startDate: dayjs().add(1, "day"),
      endDate: dayjs().add(3, "day"),
      paymentState: PaymentState.DEPOSIT_PAID,
      fullPrice: 65000,
      depositPrice: 10000,
      comment: "Előleg fizetve.",
    },
    {
      id: "2",
      groupId: "2",
      clientId: "1",
      startDate: dayjs().add(3, "day"),
      endDate: dayjs().add(10, "day"),
      paymentState: PaymentState.NOT_PAID,
      fullPrice: 120000,
      depositPrice: 25000,
    },
    {
      id: "3",
      groupId: "2",
      clientId: "3",
      startDate: dayjs().subtract(10, "day"),
      endDate: dayjs().subtract(5, "day"),
      paymentState: PaymentState.FULL_PAID,
      paymentDate: dayjs().subtract(5, "day"),
      fullPrice: 100000,
      depositPrice: 20000,
      comment: "Teljes összeg fizetve.",
    },
    {
      id: "4",
      groupId: "3",
      clientId: "2",
      startDate: dayjs(),
      endDate: dayjs().add(11, "day"),
      paymentState: PaymentState.CANCELLED,
      paymentDate: dayjs().subtract(5, "day"),
      fullPrice: 100000,
      depositPrice: 20000,
      comment: "Teljes összeg fizetve.",
    },
    {
      id: "5",
      groupId: "4",
      clientId: "2",
      startDate: dayjs("2023-06-21"),
      endDate: dayjs("2023-07-01"),
      paymentState: PaymentState.BLOCKED,
      paymentDate: dayjs().subtract(5, "day"),
      fullPrice: 100000,
      depositPrice: 20000,
      comment: "Teljes összeg fizetve.",
    },
    {
      id: "6",
      groupId: "4",
      clientId: "2",
      startDate: dayjs("2023-06-20"),
      endDate: dayjs("2023-06-21"),
      paymentState: PaymentState.FULL_PAID,
      paymentDate: dayjs().subtract(5, "day"),
      fullPrice: 100000,
      depositPrice: 20000,
      comment: "Teljes összeg fizetve.",
    },
    {
      id: "7",
      groupId: "4",
      startDate: dayjs("2023-07-01"),
      endDate: dayjs("2023-07-05"),
      paymentState: PaymentState.FULL_PAID,
      paymentDate: dayjs().subtract(5, "day"),
      fullPrice: 100000,
      depositPrice: 20000,
      comment: "Teljes összeg fizetve.",
    },
  ]);

  const addReservation = (reservation: Reservation) => {
    setReservations((prevReservations) => {
      return [...prevReservations, reservation];
    });
  };

  const removeReservation = (id: string) => {
    setReservations((prevReservations) => {
      return prevReservations.filter((reservation) => reservation.id !== id);
    });
  };

  const updateReservation = (id: string, reservation: Reservation) => {
    setReservations((prevReservations) => {
      return prevReservations.map((prevReservation) => {
        if (prevReservation.id === id) {
          return reservation;
        }
        return prevReservation;
      });
    });
  };

  const findReservationByDate = (date: dayjs.Dayjs, groupId: string): Reservation | null => {
    const reservation = reservations.find((reservation) => {
      return (
        (reservation.groupId === groupId &&
          date.isAfter(reservation.startDate) &&
          date.isBefore(reservation.endDate)) ||
        date.isSame(reservation.startDate) ||
        date.isSame(reservation.endDate)
      );
    });
    return reservation || null;
  };

  const context: ReservationContextObject = {
    reservations,
    setReservations,
    addReservation,
    removeReservation,
    updateReservation,
    findReservationByDate,
  };

  return <ReservationContext.Provider value={context}>{props.children}</ReservationContext.Provider>;
};

export default ReservationContextProvider;
