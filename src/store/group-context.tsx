import React, { useEffect, useState } from "react";
import Group from "@/models/group/group-model";
import { deleteGroupDb, readGroups, saveGroupDb } from "@/firebase/firestore-helpers/utils";
import { useAuthContext, useUser } from "./user-context";

interface IGroupsContextObject {
  groups: Group[];
  loadGroups: () => void;
  setGroups: (groups: Group[]) => void;
  setGroupsWithSave: (groups: Group[]) => void;
  addGroup: (group: Group) => void;
  removeGroup: (id: string) => void;
  updateGroup: (id: string, group: Group) => void;
  getGroup: (id: string) => Group | undefined;
}

export const GroupContext = React.createContext<IGroupsContextObject>({
  groups: [],
  loadGroups: () => {},
  setGroups: () => {},
  setGroupsWithSave: () => {},
  addGroup: () => {},
  removeGroup: () => {},
  updateGroup: () => {},
  getGroup: () => undefined,
});

const GroupContextProvider: React.FC<{ children: React.ReactNode }> = (props) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const user = useUser();
  const authCtx = useAuthContext();

  //Loading groups
  useEffect(() => {
    loadGroups();
  }, [authCtx.initialUserDataChecked]);

  const loadGroups = () => {
    if (!user || !authCtx.initialUserDataChecked) {
      setGroups([]);
      return;
    }
    readGroups(user).then((groups) => {
      groups.sort((a, b) => a.order - b.order);
      setGroups(groups);
    });
  };

  //Elmenti a változtatásokat, és létrehozza a csoportot ha még nem létezik
  const saveGroup = async (group: Group) => {
    if (!user) {
      return;
    }
    saveGroupDb(user, group);
  };

  //A csoportot törölt állapotba helyezi ezzel elrejtve a felhasználó elől
  const deleteGroup = async (id: string) => {
    if (!user) {
      return;
    }
    deleteGroupDb(user, id);
  };

  const setGroupsWithSave = (orderedGroups: Group[]) => {    
    for (let i = 0; i < orderedGroups.length; i++) {
      const group = orderedGroups[i];
      if (group.order !== i) {
        const newGroup = {...group, order: i};
        saveGroup(newGroup);
      }
    }
    setGroups(orderedGroups);
  };

  const addGroup = (group: Group) => {
    setGroups((prevGroups) => {
      return [...prevGroups, group];
    });
    saveGroup(group);
  };

  const removeGroup = (id: string) => {
    setGroups((prevGroups) => {
      return prevGroups.filter((group) => group.id !== id);
    });
    deleteGroup(id);
  };

  const updateGroup = (id: string, group: Group) => {
    setGroups((prevGroups) => {
      return prevGroups.map((prevGroup) => {
        if (prevGroup.id === id) {
          return group;
        }
        return prevGroup;
      });
    });
    saveGroup(group);
  };

  const getGroup = (id: string) => {
    return groups.find((group) => group.id === id);
  };

  const context: IGroupsContextObject = {
    groups,
    loadGroups,
    setGroups,
    setGroupsWithSave,
    addGroup,
    removeGroup,
    updateGroup,
    getGroup,
  };

  return <GroupContext.Provider value={context}>{props.children}</GroupContext.Provider>;
};

export default GroupContextProvider;
