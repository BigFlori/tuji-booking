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
  findReservationByDate: (date: dayjs.Dayjs, groupId: string) => Reservation[];
  shouldDateBeDisabled: (date: dayjs.Dayjs, reservation: Reservation, type: "startDate" | "endDate") => boolean;
  getLatestReservation: (groupId: string) => Reservation | null;
};

export const ReservationContext = React.createContext<ReservationContextObject>({
  reservations: [],
  setReservations: () => {},
  addReservation: () => {},
  removeReservation: () => {},
  updateReservation: () => {},
  findReservationByDate: () => [],
  shouldDateBeDisabled: () => false,
  getLatestReservation: () => null,
});

const ReservationContextProvider: React.FC<{ children: React.ReactNode }> = (props) => {
  const [reservations, setReservations] = React.useState<Reservation[]>([
    {
      id: "1",
      groupId: "1",
      clientId: "1",
      startDate: dayjs(dayjs().add(1, "day").format("YYYY-MM-DD")),
      endDate: dayjs(dayjs().add(3, "day").format("YYYY-MM-DD")),
      paymentState: PaymentState.DEPOSIT_PAID,
      fullPrice: 65000,
      depositPrice: 10000,
      comment: "Előleg fizetve.",
    },
    {
      id: "2",
      groupId: "2",
      clientId: "1",
      startDate: dayjs(dayjs().add(3, "day").format("YYYY-MM-DD")),
      endDate: dayjs(dayjs().add(10, "day").format("YYYY-MM-DD")),
      paymentState: PaymentState.NOT_PAID,
      fullPrice: 120000,
      depositPrice: 25000,
    },
    {
      id: "3",
      groupId: "2",
      clientId: "3",
      startDate: dayjs(dayjs().subtract(10, "day").format("YYYY-MM-DD")),
      endDate: dayjs(dayjs().subtract(5, "day").format("YYYY-MM-DD")),
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
      startDate: dayjs(dayjs().format("YYYY-MM-DD")),
      endDate: dayjs(dayjs().add(11, "day").format("YYYY-MM-DD")),
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
      startDate: dayjs("2023-06-30"),
      endDate: dayjs("2023-07-08"),
      paymentState: PaymentState.BLOCKED,
      paymentDate: dayjs().subtract(5, "day"),
      fullPrice: 100000,
      depositPrice: 20000,
    },
    {
      id: "6",
      groupId: "4",
      clientId: "2",
      startDate: dayjs("2023-06-20"),
      endDate: dayjs("2023-06-29"),
      paymentState: PaymentState.FULL_PAID,
      paymentDate: dayjs().subtract(5, "day"),
      fullPrice: 100000,
      depositPrice: 20000,
    },
    {
      id: "7",
      groupId: "4",
      startDate: dayjs("2023-07-08"),
      endDate: dayjs("2023-07-13"),
      paymentState: PaymentState.FULL_PAID,
      paymentDate: dayjs().subtract(5, "day"),
      fullPrice: 100000,
      depositPrice: 20000,
      comment: "Teljes összeg fizetve.",
    },
    {
      id: "8",
      groupId: "5",
      clientId: "4",
      startDate: dayjs("2023-07-02"),
      endDate: dayjs("2023-07-03"),
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
          console.log(prevReservation);
          console.log(reservation);
          return reservation;
        }
        return prevReservation;
      });
    });
  };

  //Elméletileg csak akkor adhat vissza többet, ha a két különböző foglalásnak ugyanarra a napra esik a kezdő és záró dátuma
  const findReservationByDate = (date: dayjs.Dayjs, groupId: string): Reservation[] => {
    const reservationsFound = reservations.filter((reservation) => {
      return (
        reservation.groupId === groupId &&
        ((date.isAfter(reservation.startDate) && date.isBefore(reservation.endDate)) ||
          date.isSame(reservation.startDate) ||
          date.isSame(reservation.endDate))
      );
    });

    return reservationsFound;
  };

  const shouldDateBeDisabled = (
    date: dayjs.Dayjs,
    reservation: Reservation,
    type: "startDate" | "endDate"
  ): boolean => {
    const foundReservations = findReservationByDate(date, reservation.groupId);

    if (foundReservations.length === 0) return false;
    //true ha startdate-t nézzük, false ha enddate-t
    if (foundReservations.length === 2) {
      if (type === "startDate") {
        return (
          !(foundReservations[0].endDate.isSame(date) || foundReservations[1].endDate.isSame(date)) ||
          (foundReservations[0].startDate.isSame(date) && foundReservations[0].id !== reservation.id) ||
          (foundReservations[1].startDate.isSame(date) && foundReservations[1].id !== reservation.id)
        );
      } else {
        return (
          !(foundReservations[0].startDate.isSame(date) || foundReservations[1].startDate.isSame(date)) ||
          (foundReservations[0].endDate.isSame(date) && foundReservations[0].id !== reservation.id) ||
          (foundReservations[1].endDate.isSame(date) && foundReservations[1].id !== reservation.id)
        );
      }
    }

    const foundReservation = foundReservations[0];

    if (type === "startDate") {
      return !foundReservation.endDate.isSame(date) && foundReservation.id !== reservation.id;
    } else {
      return !foundReservation.startDate.isSame(date) && foundReservation.id !== reservation.id;
    }
  };

  const getLatestReservation = (groupId: string): Reservation | null => {
    const reservationsFound = reservations.filter((reservation) => reservation.groupId === groupId);

    if (reservationsFound.length === 0) return null;

    return reservationsFound.reduce((prev, current) => {
      return prev.endDate.isAfter(current.endDate) ? prev : current;
    });
  };

  const context: ReservationContextObject = {
    reservations,
    setReservations,
    addReservation,
    removeReservation,
    updateReservation,
    findReservationByDate,
    shouldDateBeDisabled,
    getLatestReservation,
  };

  return <ReservationContext.Provider value={context}>{props.children}</ReservationContext.Provider>;
};

export default ReservationContextProvider;
