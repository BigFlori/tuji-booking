import { User } from "firebase/auth";
import {
  CollectionReference,
  DocumentData,
  Query,
  QuerySnapshot,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase.config";
import GroupType from "@/models/group/group-type-model";
import GroupState from "@/models/group/group-state-model";
import { v4 as uuidv4 } from "uuid";
import Group from "@/models/group/group-model";
import Reservation from "@/models/reservation/reservation-model";
import dayjs from "dayjs";
import Client from "@/models/client-model";
import { chunkArray, removeDuplicates } from "@/utils/helpers";
import Report from "@/models/report-model";

const initialGroup: Group = {
  id: uuidv4(),
  title: "Autó 1",
  description: "Leírás...",
  type: GroupType.CAR,
  state: GroupState.INACTIVE,
  order: 0,
};

export const isUserdataExist = async (user: User) => {
  const docRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists();
};

export const createInitialUser = async (user: User, displayName?: string | null) => {
  await isUserdataExist(user).then(async (exists) => {
    if (exists) return;

    //Create user document
    setDoc(
      doc(db, "users", user.uid),
      {
        displayName: displayName ? displayName : "Nincs megjeleníthető név",
        createdAt: dayjs().toISOString(),
      },
      { merge: true }
    );

    addDoc(collection(db, "users", user.uid, "clients"), {});
    await setDoc(doc(db, "users", user.uid, "groups", initialGroup.id), initialGroup);
    addDoc(collection(db, "users", user.uid, "reservations"), {});
    addDoc(collection(db, "users", user.uid, "reports"), {});
  });
};

export const readGroups = async (user: User) => {
  //Read groups
  const groupsRef = collection(db, "users", user.uid, "groups");
  const groups: Group[] = [];
  await getDocs(groupsRef).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      if (!doc.data().hasOwnProperty("id")) return;
      const group = doc.data() as Group;
      if (group.state === GroupState.DELETED) return;
      groups.push(group);
    });
  });
  return groups;
};

export const saveGroupDb = async (user: User, group: Group) => {
  const groupRef = doc(db, "users", user.uid, "groups", group.id);
  await setDoc(groupRef, group, { merge: true });
};

export const deleteGroupDb = async (user: User, groupId: string) => {
  const groupRef = doc(db, "users", user.uid, "groups", groupId);
  await deleteDoc(groupRef);
};

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

export const searchReservationByClient = async (user: User, clientId: string) => {
  const queryRes = query(collection(db, "users", user.uid, "reservations"), where("clientId", "==", clientId));
  const foundReservations: Reservation[] = [];
  await processReservationQuerySnapshot(queryRes).then((reservations) => {
    foundReservations.push(...reservations);
  });
  return foundReservations;
};

export const fetchReservationsInPeriod = async (user: User, startDate: dayjs.Dayjs, endDate: dayjs.Dayjs) => {
  const queryRes = query(
    collection(db, "users", user.uid, "reservations"),
    where("endDateTimestamp", ">=", startDate.unix()),
    where("endDateTimestamp", "<=", endDate.unix())
  );
  const foundReservations: Reservation[] = [];
  await processReservationQuerySnapshot(queryRes).then((reservations) => {
    foundReservations.push(...reservations);
  });
  return foundReservations;
};

export const readReservations = async (user: User) => {
  const reservationsRef = collection(db, "users", user.uid, "reservations");
  const reservations: Reservation[] = [];
  processReservationQuerySnapshot(reservationsRef).then((reservations) => {
    reservations.push(...reservations);
  });
  return reservations;
};

export const updateReservations = async (user: User) => {
  await readReservations(user).then(async (reservations) => {
    reservations.forEach(async (reservation) => {
      await saveReservationDb(user, reservation);
    });
  });
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
  await deleteDoc(reservationRef);
};

export const fetchClientsById = async (user: User, clientIds: string[]) => {
  const uniqueIds = removeDuplicates(clientIds);
  const chunkedArrays = chunkArray(uniqueIds, 30);
  const foundClients: Client[] = [];

  for (let i = 0; i < chunkedArrays.length; i++) {
    const queryResult = query(collection(db, "users", user.uid, "clients"), where("id", "in", chunkedArrays[i]));
    await getDocs(queryResult).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (!doc.data().hasOwnProperty("id")) return;
        const client = doc.data() as Client;
        if (clientIds.includes(client.id)) {
          foundClients.push(client);
        }
      });
    });
  }
  return foundClients;
};
export const readClients = async (user: User) => {
  const clientsRef = collection(db, "users", user.uid, "clients");
  const clients: Client[] = [];
  await getDocs(clientsRef).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      if (!doc.data().hasOwnProperty("id")) return;
      const client = doc.data() as Client;
      clients.push(client);
    });
  });
  return clients;
};

export const saveClientDb = async (user: User, client: Client) => {
  const clientRef = doc(db, "users", user.uid, "clients", client.id);
  await setDoc(clientRef, client);
};

export const deleteClientDb = async (user: User, clientId: string) => {
  const clientRef = doc(db, "users", user.uid, "clients", clientId);
  await deleteDoc(clientRef);
};

export const fetchReports = async (user: User) => {
  const reportsRef = collection(db, "users", user.uid, "reports");
  const reports: Report[] = [];
  await getDocs(reportsRef).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      if (!doc.data().hasOwnProperty("id")) return;
      const report = doc.data() as Report;
      const modifiedReport = {
        ...report,
        createdAt: dayjs(report.createdAt),
        period: {
          from: dayjs(report.period.from),
          to: dayjs(report.period.to),
        },
      };
      reports.push(modifiedReport);
    });
  });
  return reports;
};

export const saveReportDb = async (user: User, report: Report) => {
  const modifiedReport = {
    ...report,
    createdAt: report.createdAt.toISOString(),
    period: {
      from: report.period.from.toISOString(),
      to: report.period.to.toISOString(),
    },
  };
  const reportRef = doc(db, "users", user.uid, "reports", report.id);
  await setDoc(reportRef, modifiedReport);
}

export const deleteReportDb = async (user: User, reportId: string) => {
  const reportRef = doc(db, "users", user.uid, "reports", reportId);
  await deleteDoc(reportRef);
}