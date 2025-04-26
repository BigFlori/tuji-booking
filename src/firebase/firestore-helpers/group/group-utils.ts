import { db } from "@/firebase/firebase.config";
import Group from "@/models/group/group-model";
import GroupState from "@/models/group/group-state-model";
import { User } from "firebase/auth";
import { collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";

// Lekérdezi a felhasználó csoportjait
export const readGroups = async (user: User) => {
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

// Elmenti a csoportot
export const saveGroupDb = async (user: User, group: Group) => {
  const groupRef = doc(db, "users", user.uid, "groups", group.id);
  await setDoc(groupRef, group, { merge: true });
};

// Törli a csoportot
export const deleteGroupDb = async (user: User, groupId: string) => {
  const groupRef = doc(db, "users", user.uid, "groups", groupId);
  await deleteDoc(groupRef);
};
