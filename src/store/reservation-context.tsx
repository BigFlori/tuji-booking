import React from "react";
import Reservation from "../models/reservation/reservation-model";
import dayjs from "dayjs";
import PaymentState from "@/models/reservation/payment-state-model";

interface IReservationContextObject {
  reservations: Reservation[];
  setReservations: (reservations: Reservation[]) => void;
  addReservation: (reservation: Reservation) => void;
  removeReservation: (id: string) => void;
  updateReservation: (id: string, reservation: Reservation) => void;
  findReservationByDate: (date: dayjs.Dayjs, groupId: string) => Reservation[];
  shouldDateBeDisabled: (
    date: dayjs.Dayjs,
    type: "startDate" | "endDate",
    groupId: string,
    reservationId?: string
  ) => boolean;
  getLatestReservation: (groupId: string) => Reservation | null;
  getNextReservation: (startDate: dayjs.Dayjs, groupId: string) => Reservation | null;
  canReserve: (startDate: dayjs.Dayjs, endDate: dayjs.Dayjs, groupId: string, excludedId?: string) => boolean;
}

export const ReservationContext = React.createContext<IReservationContextObject>({
  reservations: [],
  setReservations: () => {},
  addReservation: () => {},
  removeReservation: () => {},
  updateReservation: () => {},
  findReservationByDate: () => [],
  shouldDateBeDisabled: () => false,
  getLatestReservation: () => null,
  getNextReservation: () => null,
  canReserve: () => true,
});

const generateDatesBetween = (startDate: dayjs.Dayjs, endDate: dayjs.Dayjs) => {
  const dates = [];
  let currentDate = startDate;
  while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)) {
    dates.push(currentDate);
    currentDate = currentDate.add(1, "day");
  }
  return dates;
};

const ReservationContextProvider: React.FC<{ children: React.ReactNode }> = (props) => {
  const [reservations, setReservations] = React.useState<Reservation[]>([
    {
      id: "1",
      groupId: "1",
      clientId: "1",
      startDate: dayjs(dayjs().add(1, "day").format("YYYY-MM-DD")),
      startTime: dayjs(dayjs().add(1, "day").format("YYYY-MM-DD")).add(12, "hour"),
      endDate: dayjs(dayjs().add(3, "day").format("YYYY-MM-DD")),
      endTime: dayjs(dayjs().add(3, "day").format("YYYY-MM-DD")).add(18, "hour"),
      paymentState: PaymentState.DEPOSIT_PAID,
      fullPrice: 65000,
      depositPrice: 10000,
      cautionPrice: 10000,
      cautionReturned: false,
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
      cautionPrice: 25000,
      cautionReturned: false,
    },
    {
      id: "3",
      groupId: "2",
      clientId: "3",
      startDate: dayjs(dayjs().subtract(10, "day").format("YYYY-MM-DD")),
      endDate: dayjs(dayjs().subtract(5, "day").format("YYYY-MM-DD")),
      paymentState: PaymentState.FULL_PAID,
      fullPrice: 100000,
      depositPrice: 20000,
      cautionPrice: 20000,
      comment: "Teljes összeg fizetve.",
      cautionReturned: true,
    },
    {
      id: "4",
      groupId: "3",
      clientId: "2",
      startDate: dayjs(dayjs().format("YYYY-MM-DD")),
      endDate: dayjs(dayjs().add(11, "day").format("YYYY-MM-DD")),
      paymentState: PaymentState.CANCELLED,
      fullPrice: 100000,
      depositPrice: 20000,
      cautionPrice: 50000,
      comment: "Teljes összeg fizetve.",
      cautionReturned: true,
    },
    {
      id: "5",
      groupId: "4",
      clientId: "2",
      startDate: dayjs("2023-06-30"),
      endDate: dayjs("2023-07-08"),
      paymentState: PaymentState.BLOCKED,
      fullPrice: 100000,
      depositPrice: 20000,
      cautionPrice: 100000,
      cautionReturned: false,
    },
    {
      id: "6",
      groupId: "4",
      clientId: "2",
      startDate: dayjs("2023-06-20"),
      endDate: dayjs("2023-06-29"),
      paymentState: PaymentState.FULL_PAID,
      fullPrice: 100000,
      depositPrice: 20000,
      cautionPrice: 75000,
      cautionReturned: true,
    },
    {
      id: "7",
      groupId: "4",
      startDate: dayjs("2023-07-08"),
      endDate: dayjs("2023-07-13"),
      paymentState: PaymentState.FULL_PAID,
      fullPrice: 100000,
      depositPrice: 20000,
      cautionPrice: 80000,
      cautionReturned: true,
      comment: "Teljes összeg fizetve.",
    },
    {
      id: "8",
      groupId: "5",
      clientId: "4",
      startDate: dayjs("2023-07-02"),
      endDate: dayjs("2023-07-03"),
      paymentState: PaymentState.FULL_PAID,
      fullPrice: 100000,
      depositPrice: 20000,
      cautionPrice: 90000,
      cautionReturned: true,
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
    type: "startDate" | "endDate",
    groupId: string,
    reservationId?: string
  ): boolean => {
    const foundReservations = findReservationByDate(date, groupId);

    if (foundReservations.length === 0) return false;

    if (foundReservations.length === 2) {
      if (type === "startDate") {
        return (
          !(foundReservations[0].endDate.isSame(date) || foundReservations[1].endDate.isSame(date)) ||
          (foundReservations[0].startDate.isSame(date) && foundReservations[0].id !== reservationId) ||
          (foundReservations[1].startDate.isSame(date) && foundReservations[1].id !== reservationId)
        );
      } else {
        return (
          !(foundReservations[0].startDate.isSame(date) || foundReservations[1].startDate.isSame(date)) ||
          (foundReservations[0].endDate.isSame(date) && foundReservations[0].id !== reservationId) ||
          (foundReservations[1].endDate.isSame(date) && foundReservations[1].id !== reservationId)
        );
      }
    }

    const foundReservation = foundReservations[0];

    if (type === "startDate") {
      return !foundReservation.endDate.isSame(date) && foundReservation.id !== reservationId;
    } else {
      return !foundReservation.startDate.isSame(date) && foundReservation.id !== reservationId;
    }
  };

  const getLatestReservation = (groupId: string): Reservation | null => {
    const reservationsFound = reservations.filter((reservation) => reservation.groupId === groupId);

    if (reservationsFound.length === 0) return null;

    return reservationsFound.reduce((prev, current) => {
      return prev.endDate.isAfter(current.endDate) ? prev : current;
    });
  };

  const getNextReservation = (startDate: dayjs.Dayjs, groupId: string): Reservation | null => {
    const reservationsFound = reservations.filter(
      (reservation) => reservation.groupId === groupId && reservation.startDate.isAfter(startDate)
    );

    if (reservationsFound.length === 0) return null;

    return reservationsFound.reduce((prev, current) => {
      return prev.startDate.isBefore(current.startDate) ? prev : current;
    });
  };

  //1. Megnézi, hogy a két dátum között van-e már foglalás
  //2. Megnézi, hogy a két dátum között van-e már foglalás, aminek a kezdő vagy záró dátuma megegyezik a kezdő vagy záró dátummal
  const canReserve = (startDate: dayjs.Dayjs, endDate: dayjs.Dayjs, groupId: string, excludedId?: string): boolean => {
    const dates = generateDatesBetween(startDate, endDate);
    //Kivesszük a záró dátumot, mert azt nem kell vizsgálni
    dates.pop();

    let foundAnyReservation = false;
    dates.forEach((date) => {
      const foundReservations = findReservationByDate(date, groupId);

      if (foundReservations.length >= 2) {
        const otherReservation = foundReservations.find((reservation) => reservation.id !== excludedId);
        if (otherReservation && date.isBefore(otherReservation.endDate) && !date.isSame(otherReservation.endDate)) {
          foundAnyReservation = true;
          return;
        }
      }
      if (
        foundReservations.length === 1 &&
        date.isBefore(foundReservations[0].endDate) &&
        !date.isSame(foundReservations[0].endDate) &&
        foundReservations[0].id !== excludedId
      ) {
        foundAnyReservation = true;
        return;
      }
    });

    return !foundAnyReservation;
  };

  const context: IReservationContextObject = {
    reservations,
    setReservations,
    addReservation,
    removeReservation,
    updateReservation,
    findReservationByDate,
    shouldDateBeDisabled,
    getLatestReservation,
    getNextReservation,
    canReserve,
  };

  return <ReservationContext.Provider value={context}>{props.children}</ReservationContext.Provider>;
};

export default ReservationContextProvider;
