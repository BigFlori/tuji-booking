import React from "react";
import Reservation from "../models/reservation-model";
import dayjs from "dayjs";
import PaymentStatus from "@/models/payment-status-model";

type ReservationContextObject = {
  reservations: Reservation[];
  setReservations: (reservations: Reservation[]) => void;
  addReservation: (reservation: Reservation) => void;
  removeReservation: (id: number) => void;
  updateReservation: (id: number, reservation: Reservation) => void;
  findReservationByDate: (
    date: dayjs.Dayjs,
    groupId: number
  ) => Reservation | null;
};

export const ReservationContext = React.createContext<ReservationContextObject>(
  {
    reservations: [],
    setReservations: () => {},
    addReservation: () => {},
    removeReservation: () => {},
    updateReservation: () => {},
    findReservationByDate: () => null,
  }
);

const ReservationContextProvider: React.FC<{ children: React.ReactNode }> = (
  props
) => {
  const [reservations, setReservations] = React.useState<Reservation[]>([
    {
      id: 1,
      groupId: 1,
      startDate: dayjs().add(1, "day"),
      endDate: dayjs().add(3, "day"),
      paymentStatus: PaymentStatus.DEPOSIT_PAID,
      fullPrice: 65000,
      depositPrice: 10000,
      comment: "Előleg fizetve.",
    },
    {
      id: 2,
      groupId: 2,
      startDate: dayjs().add(3, "day"),
      endDate: dayjs().add(10, "day"),
      paymentStatus: PaymentStatus.NOT_PAID,
      fullPrice: 120000,
      depositPrice: 25000,
    },
    {
      id: 3,
      groupId: 2,
      startDate: dayjs().subtract(10, "day"),
      endDate: dayjs().subtract(5, "day"),
      paymentStatus: PaymentStatus.FULL_PAID,
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

  const removeReservation = (id: number) => {
    setReservations((prevReservations) => {
      return prevReservations.filter((reservation) => reservation.id !== id);
    });
  };

  const updateReservation = (id: number, reservation: Reservation) => {
    setReservations((prevReservations) => {
      return prevReservations.map((prevReservation) => {
        if (prevReservation.id === id) {
          return reservation;
        }
        return prevReservation;
      });
    });
  };

  const findReservationByDate = (
    date: dayjs.Dayjs,
    groupId: number
  ): Reservation | null => {
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

  return (
    <ReservationContext.Provider value={context}>
      {props.children}
    </ReservationContext.Provider>
  );
};

export default ReservationContextProvider;
