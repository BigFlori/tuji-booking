import { db } from "@/firebase/firebase.config";
import Reservation from "@/models/reservation/reservation-model";
import { chunkArray } from "@/utils/helpers";
import dayjs from "dayjs";
import { User } from "firebase/auth";
import {
  CollectionReference,
  DocumentData,
  Query,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";

// Egységesített logika a foglalások feldolgozására
const processReservationQuerySnapshot = async (
  queryRes: Query<DocumentData> | CollectionReference<DocumentData>,
  user: User
) => {
  const reservations: Reservation[] = [];
  await getDocs(queryRes).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      if (!doc.data().hasOwnProperty("id")) return;
      const reservation = doc.data() as Reservation;
      const modifiedReservation = {
        ...reservation,
        startDate: dayjs(reservation.startDate),
        startTime: reservation.startTime ? dayjs(reservation.startTime) : undefined,
        endDate: dayjs(reservation.endDate),
        endTime: reservation.endTime ? dayjs(reservation.endTime) : undefined,
      };

      //Check for missing fields
      if (!Object.hasOwn(modifiedReservation, "expenses")) {
        modifiedReservation.expenses = 0;
        saveReservationDb(user, modifiedReservation);
      }

      reservations.push(modifiedReservation);
    });
  });
  return reservations;
};

// Lekérdezi egy ügyfélhez tartozó összes foglalást
export const searchReservationByClient = async (user: User, clientId: string) => {
  const queryRes = query(collection(db, "users", user.uid, "reservations"), where("clientId", "==", clientId));
  const foundReservations: Reservation[] = [];
  await processReservationQuerySnapshot(queryRes, user).then((reservations) => {
    foundReservations.push(...reservations);
  });
  return foundReservations;
};

// Lekérdezi a felhasználó foglalásait a megadott időszakban, tovább szűrhető csoportok szerint
export const fetchReservationsInPeriod = async (
  user: User,
  startDate: dayjs.Dayjs,
  endDate?: dayjs.Dayjs,
  groupIds?: string[]
) => {
  let queryResults: Query<DocumentData>[] = [];
  const foundReservations: Reservation[] = [];

  if (!groupIds || groupIds.length === 0) {
    // Ha nincs megadva csoport vagy üres a tömb, akkor az összes foglalást lekérdezi az időszakban
    let queryRes: Query<DocumentData>;

    if (endDate) {
      queryRes = query(
        collection(db, "users", user.uid, "reservations"),
        where("endDateTimestamp", ">=", startDate.unix()),
        where("endDateTimestamp", "<=", endDate.unix())
      );
    } else {
      queryRes = query(
        collection(db, "users", user.uid, "reservations"),
        where("endDateTimestamp", ">=", startDate.unix())
      );
    }

    queryResults.push(queryRes);
  } else {
    // Firebase "in" query max 10 elemet támogat, így több lekérdezést kell indítanunk,
    // ha több mint 10 csoport van kiválasztva
    const groupChunks = chunkArray(groupIds, 10);

    for (const chunk of groupChunks) {
      let queryRes: Query<DocumentData>;

      if (endDate) {
        queryRes = query(
          collection(db, "users", user.uid, "reservations"),
          where("endDateTimestamp", ">=", startDate.unix()),
          where("endDateTimestamp", "<=", endDate.unix()),
          where("groupId", "in", chunk)
        );
      } else {
        queryRes = query(
          collection(db, "users", user.uid, "reservations"),
          where("endDateTimestamp", ">=", startDate.unix()),
          where("groupId", "in", chunk)
        );
      }

      queryResults.push(queryRes);
    }
  }

  for (const queryRes of queryResults) {
    const reservations = await processReservationQuerySnapshot(queryRes, user);
    foundReservations.push(...reservations);
  }

  return foundReservations;
};

// Lekérdezi a felhasználó foglalásait a megadott hónapban
export const fetchReservationsInMonth = async (
  user: User,
  isInitialFetch: boolean,
  year: number,
  monthIndex: number
) => {
  const foundReservations: Reservation[] = [];
  if (monthIndex < 0 || monthIndex > 11) return foundReservations;

  const monthDate = dayjs(`${year}-${monthIndex + 1}-01`);

  let queryResult = query(
    collection(db, "users", user.uid, "reservations"),
    //Az adott hónap után mindent betölt
    where("endDateTimestamp", ">=", monthDate.unix())
  );

  if (!isInitialFetch) {
    queryResult = query(
      collection(db, "users", user.uid, "reservations"),
      //Az adott hónapot tölti be,
      where("endDateTimestamp", ">=", monthDate.unix()),
      where("endDateTimestamp", "<=", monthDate.add(1, "month").unix())
    );
  }

  await processReservationQuerySnapshot(queryResult, user).then((reservations) => {
    foundReservations.push(...reservations);
  });

  return foundReservations;
};

// Elmenti a foglalást az adatbázisba
export const saveReservationDb = async (user: User, reservation: Reservation) => {
  const modifiedReservation = {
    ...reservation,
    startDate: reservation.startDate.toISOString(),
    startTime: reservation.startTime ? reservation.startTime?.toISOString() : "",
    startDateTimestamp: reservation.startDate.unix(),
    endDate: reservation.endDate.toISOString(),
    endTime: reservation.endTime ? reservation.endTime?.toISOString() : "",
    endDateTimestamp: reservation.endDate.unix(),
  };
  const reservationRef = doc(db, "users", user.uid, "reservations", reservation.id);
  await setDoc(reservationRef, modifiedReservation);
};

// Törli a foglalást az adatbázisból
export const deleteReservationDb = async (user: User, reservationId: string) => {
  const reservationRef = doc(db, "users", user.uid, "reservations", reservationId);
  await deleteDoc(reservationRef).catch((error) => {
    console.error("Error removing document: ", error);
  });
};
