import { User } from "firebase/auth";
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import GroupType from "@/models/group/group-type-model";
import GroupState from "@/models/group/group-state-model";
import { v4 as uuidv4 } from "uuid";
import Group from "@/models/group/group-model";
import dayjs from "dayjs";

const initialGroup: Group = {
  id: uuidv4(),
  title: "Autó 1",
  description: "Leírás...",
  type: GroupType.CAR,
  state: GroupState.INACTIVE,
  order: 0,
};

// Ellenőrzi, hogy a felhasználó adatai léteznek-e
export const isUserdataExist = async (user: User) => {
  const docRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists();
};

// User létrehozása, ha még nem létezik
export const createInitialUser = async (user: User, displayName?: string | null) => {
  await isUserdataExist(user).then(async (exists) => {
    if (exists) return;

    // User dokumentum létrehozása
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
  });
};
