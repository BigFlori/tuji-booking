import { User } from "firebase/auth";
import { addDoc, collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import GroupType from "@/models/group/group-type-model";
import GroupState from "@/models/group/group-state-model";
import { v4 as uuidv4 } from "uuid";
import Group from "@/models/group/group-model";
import { IRegisterFormModel } from "@/components/Forms/register/RegisterLogic";

const initialGroup: Group = {
  id: uuidv4(),
  title: "Autó 1",
  description: "Leírás...",
  type: GroupType.CAR,
  state: GroupState.INACTIVE,
};

export const createInitialUser = async (user: User, data?: IRegisterFormModel) => {
  //Create user document
  setDoc(doc(db, "users", user.uid), {
    firstName: data!.firstName,
    lastName: data!.lastName,
  });

  addDoc(collection(db, "users", user.uid, "clients"), {});
  setDoc(doc(db, "users", user.uid, "groups", initialGroup.id), initialGroup);
  addDoc(collection(db, "users", user.uid, "reservations"), {});
};

export const readGroups = async (user: User) => {
  //Read groups
  const groupsRef = collection(db, "users", user.uid, "groups");
  const groups: Group[] = [];
  await getDocs(groupsRef).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
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
