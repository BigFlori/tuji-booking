import React, { useContext, useState } from "react";
import Group from "@/models/group/group-model";
import { deleteGroupDb, readGroups, saveGroupDb } from "@/firebase/firestore-helpers/group/group-utils";
import { useUser } from "./user-context";
import { useReservationContext } from "./reservation-context";
import { useQuery } from "react-query";

interface IGroupsContextObject {
  groups: Group[];
  setGroups: (groups: Group[]) => void;
  setGroupsWithSave: (groups: Group[]) => void;
  addGroup: (group: Group) => void;
  removeGroup: (id: string) => void;
  updateGroup: (id: string, group: Group) => void;
  getGroup: (id: string) => Group | undefined;
}

export const GroupContext = React.createContext<IGroupsContextObject>({
  groups: [],
  setGroups: () => {},
  setGroupsWithSave: () => {},
  addGroup: () => {},
  removeGroup: () => {},
  updateGroup: () => {},
  getGroup: () => undefined,
});

export const useGroupContext = () => {
  return useContext(GroupContext);
};

const GroupContextProvider: React.FC<{ children: React.ReactNode }> = (props) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const user = useUser();
  const reservationCtx = useReservationContext();

  const query = useQuery({
    queryKey: ["groups", user?.uid],
    queryFn: async () => {
      if (!user) return [];
      return readGroups(user);
    },
    refetchOnWindowFocus: false,
    onSuccess(data) {
      data.sort((a, b) => a.order - b.order);
      setGroups(data);
    },
    onError(error) {
      setGroups([]);
      console.error(error);
    },
  });

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
        const newGroup = { ...group, order: i };
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
    //Törli a csoportba tartozó foglalásokat
    const reservationsInGroup = reservationCtx.getReservationsInGroup(id);
    reservationsInGroup.forEach((reservation) => {
      reservationCtx.removeReservation(reservation.id);
    });

    //Törli a csoportot
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
