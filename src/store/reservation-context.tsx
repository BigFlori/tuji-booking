import React, { Dispatch, SetStateAction, useContext, useState } from "react";
import Reservation from "../models/reservation/reservation-model";
import dayjs from "dayjs";
import {
  deleteReservationDb,
  fetchReservationsInPeriod,
  saveReservationDb,
} from "@/firebase/firestore-helpers/reservation/reservation-utils";
import { useUser } from "./user-context";
import { useQuery } from "react-query";

interface IReservationContextObject {
  reservations: Reservation[];
  setFetchStartDate: (date: dayjs.Dayjs) => void;
  setReservations: Dispatch<SetStateAction<Reservation[]>>;
  addReservation: (reservation: Reservation) => void;
  removeReservation: (id: string) => void;
  updateReservation: (id: string, reservation: Reservation) => void;
  getReservationsInGroup: (groupId: string) => Reservation[];
  getReservationsByClient: (clientId: string) => Reservation[];
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
  setFetchStartDate: () => {},
  setReservations: () => {},
  addReservation: () => {},
  removeReservation: () => {},
  updateReservation: () => {},
  getReservationsInGroup: () => [],
  getReservationsByClient: () => [],
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

export const useReservationContext = () => {
  return useContext(ReservationContext);
};

const ReservationContextProvider: React.FC<{ children: React.ReactNode }> = (props) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const user = useUser();

  const [cachedPeriods, setCachedPeriods] = useState<{ [key: string]: Reservation[] }>({});
  const [startDate, setStartDate] = useState(dayjs().subtract(2, "month").startOf("month"));
  const [endDate, setEndDate] = useState(dayjs().add(50, "year"));

  const { data: fetchedReservations, isLoading } = useQuery({
    queryKey: ["reservations", user?.uid, startDate, endDate],
    queryFn: async () => {
      if (!user) return [];
      if (cachedPeriods[`${startDate.unix()}-${endDate.unix()}`]) {
        return cachedPeriods[`${startDate.unix()}-${endDate.unix()}`];
      }
      return fetchReservationsInPeriod(user, startDate, endDate);
    },
    refetchOnWindowFocus: false,
    onSuccess(data) {
      setCachedPeriods((prevData) => {
        return { ...prevData, [`${startDate.unix()}-${endDate.unix()}`]: data };
      });
      setReservations((prevData) => {
        const filtered = data.filter(
          (reservation) => !prevData.some((prevReservation) => prevReservation.id === reservation.id)
        );
        return [...prevData, ...filtered];
      });
    },
    onError(error) {
      setReservations([]);
      setCachedPeriods({});
      console.error(error);
    },
  });

  const setFetchStartDate = (date: dayjs.Dayjs) => {
    if (date.isAfter(startDate) || date.isSame(startDate)) return;
    console.log("setting start date" + date.format("YYYY-MM-DD"));
    setStartDate((prevValue) => {
      setEndDate(prevValue);
      return date;
    });
  };

  //Elmenti a változatásokat, és létrehozza a foglalást ha még nem létezik
  const saveReservation = async (reservation: Reservation) => {
    if (!user) {
      return;
    }
    saveReservationDb(user, reservation);
  };

  //A foglalást teljesen kitörli az adatbázisból
  const deleteReservation = async (id: string) => {
    if (!user) {
      return;
    }
    deleteReservationDb(user, id);
  };

  const addReservation = (reservation: Reservation) => {
    setReservations((prevReservations) => {
      if (prevReservations.some((prevReservation) => prevReservation.id === reservation.id)) {
        return prevReservations;
      }
      return [...prevReservations, reservation];
    });
    saveReservation(reservation);
  };

  const removeReservation = (id: string) => {
    setReservations((prevReservations) => {
      return prevReservations.filter((reservation) => reservation.id !== id);
    });
    deleteReservation(id);
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
    saveReservation(reservation);
  };

  //Visszaadja az összes foglalást, ami a megadott csoportban van
  const getReservationsInGroup = (groupId: string): Reservation[] => {
    return reservations.filter((reservation) => reservation.groupId === groupId);
  };

  //Visszaadja az összes foglalást, ami a megadott ügyfélhez tartozik
  const getReservationsByClient = (clientId: string): Reservation[] => {
    return reservations.filter((reservation) => reservation.clientId === clientId);
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

  //Ellenőrzi, hogy az adott dátumra lehetséges-e foglalni
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

  //A legkésőbbi foglalást adja vissza az adott csoportban
  const getLatestReservation = (groupId: string): Reservation | null => {
    const reservationsFound = reservations.filter((reservation) => reservation.groupId === groupId);

    if (reservationsFound.length === 0) return null;

    return reservationsFound.reduce((prev, current) => {
      return prev.endDate.isAfter(current.endDate) ? prev : current;
    });
  };

  //A megadott dátumtól fogva a legközelebbi foglalást adja vissza az adott csoportban
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
    setFetchStartDate,
    setReservations,
    addReservation,
    removeReservation,
    updateReservation,
    getReservationsInGroup,
    getReservationsByClient,
    shouldDateBeDisabled,
    getLatestReservation,
    getNextReservation,
    canReserve,
  };

  return <ReservationContext.Provider value={context}>{props.children}</ReservationContext.Provider>;
};

export default ReservationContextProvider;
