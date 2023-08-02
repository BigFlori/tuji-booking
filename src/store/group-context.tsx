import React, { useEffect, useState } from "react";
import Group from "@/models/group/group-model";
import GroupState from "@/models/group/group-state-model";
import GroupType from "@/models/group/group-type-model";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebase.config";
import { deleteGroupDb, readGroups, saveGroupDb } from "@/firebase/firestore-helpers/utils";

interface IGroupsContextObject {
  groups: Group[];
  isLoading: boolean;
  setGroups: (groups: Group[]) => void;
  addGroup: (group: Group) => void;
  removeGroup: (id: string) => void;
  updateGroup: (id: string, group: Group) => void;
  getGroup: (id: string) => Group | undefined;
}

export const GroupContext = React.createContext<IGroupsContextObject>({
  groups: [],
  isLoading: false,
  setGroups: () => {},
  addGroup: () => {},
  removeGroup: () => {},
  updateGroup: () => {},
  getGroup: () => undefined,
});

const GroupContextProvider: React.FC<{ children: React.ReactNode }> = (props) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user] = useAuthState(auth);

  //Loading groups
  useEffect(() => {
    if (!user) {
      setGroups([]);
      return;
    }
    console.log("Loading groups");
    
    readGroups(user)
      .then((groups) => {
        setGroups(groups);
      })
      .finally(() => {
        setIsLoading(false);
        console.log("Groups loaded");
      });
  }, [user]);

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
    isLoading,
    setGroups,
    addGroup,
    removeGroup,
    updateGroup,
    getGroup,
  };

  return <GroupContext.Provider value={context}>{props.children}</GroupContext.Provider>;
};

export default GroupContextProvider;
