import { User } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import GroupType from "@/models/group/group-type-model";
import GroupState from "@/models/group/group-state-model";
import { v4 as uuidv4 } from "uuid";
import Group from "@/models/group/group-model";
import Reservation from "@/models/reservation/reservation-model";
import dayjs from "dayjs";
import Client from "@/models/client-model";

const initialGroup: Group = {
  id: uuidv4(),
  title: "Autó 1",
  description: "Leírás...",
  type: GroupType.CAR,
  state: GroupState.INACTIVE,
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
    setDoc(doc(db, "users", user.uid, "groups", initialGroup.id), initialGroup);
    await addDoc(collection(db, "users", user.uid, "reservations"), {});
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
  await setDoc(groupRef, group);
};

export const deleteGroupDb = async (user: User, groupId: string) => {
  const groupRef = doc(db, "users", user.uid, "groups", groupId);
  await setDoc(groupRef, { state: GroupState.DELETED }, { merge: true });
};

export const readReservations = async (user: User) => {
  const reservationsRef = collection(db, "users", user.uid, "reservations");
  const reservations: Reservation[] = [];
  await getDocs(reservationsRef).then((querySnapshot) => {
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

export const saveReservationDb = async (user: User, reservation: Reservation) => {
  const modifiedReservation = {
    ...reservation,
    startDate: reservation.startDate.toISOString(),
    startTime: reservation.startTime && reservation.startTime?.toISOString(),
    endDate: reservation.endDate.toISOString(),
    endTime: reservation.endTime && reservation.endTime?.toISOString(),
  };
  const reservationRef = doc(db, "users", user.uid, "reservations", reservation.id);
  await setDoc(reservationRef, modifiedReservation);
};

export const deleteReservationDb = async (user: User, reservationId: string) => {
  const reservationRef = doc(db, "users", user.uid, "reservations", reservationId);
  await deleteDoc(reservationRef);
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
