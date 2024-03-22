import { db } from "@/firebase/firebase.config";
import Reservation from "@/models/reservation/reservation-model";
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

const processReservationQuerySnapshot = async (queryRes: Query<DocumentData> | CollectionReference<DocumentData>) => {
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
      reservations.push(modifiedReservation);
    });
  });
  return reservations;
};

//Used by SearchBar
export const searchReservationByClient = async (user: User, clientId: string) => {
  const queryRes = query(collection(db, "users", user.uid, "reservations"), where("clientId", "==", clientId));
  const foundReservations: Reservation[] = [];
  await processReservationQuerySnapshot(queryRes).then((reservations) => {
    foundReservations.push(...reservations);
  });
  return foundReservations;
};

export const fetchReservationsInPeriod = async (user: User, startDate: dayjs.Dayjs, endDate?: dayjs.Dayjs) => {
  let queryRes = query(
    collection(db, "users", user.uid, "reservations"),
    where("endDateTimestamp", ">=", startDate.unix())
  );

  if (endDate) {
    queryRes = query(
      collection(db, "users", user.uid, "reservations"),
      where("endDateTimestamp", ">=", startDate.unix()),
      where("endDateTimestamp", "<=", endDate.unix())
    );
  }

  const foundReservations: Reservation[] = [];
  await processReservationQuerySnapshot(queryRes).then((reservations) => {
    foundReservations.push(...reservations);
  });
  console.log(`fetched ${foundReservations.length} reservations from ${startDate} to ${endDate}`); // eslint-disable-line no-console

  return foundReservations;
};

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

  await processReservationQuerySnapshot(queryResult).then((reservations) => {
    foundReservations.push(...reservations);
  });

  //console.log(`found reservations from ${monthIndex + 1}: `, foundReservations);

  return foundReservations;
};

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

export const deleteReservationDb = async (user: User, reservationId: string) => {
  const reservationRef = doc(db, "users", user.uid, "reservations", reservationId);
  await deleteDoc(reservationRef).catch((error) => {
    console.error("Error removing document: ", error);
  });
};

// export const updateReservations = async (user: User) => {
//   const readReservations = async (user: User) => {
//     const reservationsRef = collection(db, "users", user.uid, "reservations");
//     const reservations: Reservation[] = [];
//     processReservationQuerySnapshot(reservationsRef).then((reservations) => {
//       reservations.push(...reservations);
//     });
//     return reservations;
//   };

//   await readReservations(user).then(async (reservations) => {
//     reservations.forEach(async (reservation) => {
//       await saveReservationDb(user, reservation);
//     });
//   });
// };
