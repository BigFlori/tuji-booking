import React from "react";
import Group from "@/models/group-model";

type GroupsContextObject = {
  groups: Group[];
  setGroups: (groups: Group[]) => void;
  addGroup: (group: Group) => void;
  removeGroup: (id: number) => void;
  updateGroup: (id: number, group: Group) => void;
};

export const GroupContext = React.createContext<GroupsContextObject>({
  groups: [],
  setGroups: () => {},
  addGroup: () => {},
  removeGroup: () => {},
  updateGroup: () => {},
});

const GroupContextProvider: React.FC<{ children: React.ReactNode }> = (
  props
) => {
  const [groups, setGroups] = React.useState<Group[]>([
    { id: 1, title: "Group 1" },
    { id: 2, title: "Group 2" },
    { id: 3, title: "Group 3" },
    { id: 4, title: "Group 4" },
    { id: 5, title: "Group 5" },
    // { id: 6, title: "Group 6" },
    // { id: 7, title: "Group 7" },
    // { id: 8, title: "Group 8" },
    // { id: 9, title: "Group 9" },
    // { id: 10, title: "Group 10" },
    // { id: 11, title: "Group 11" },
  ]);

  const addGroup = (group: Group) => {
    setGroups((prevGroups) => {
      return [...prevGroups, group];
    });
  };

  const removeGroup = (id: number) => {
    setGroups((prevGroups) => {
      return prevGroups.filter((group) => group.id !== id);
    });
  };

  const updateGroup = (id: number, group: Group) => {
    setGroups((prevGroups) => {
      return prevGroups.map((prevGroup) => {
        if (prevGroup.id === id) {
          return group;
        }
        return prevGroup;
      });
    });
  };

  const context: GroupsContextObject = {
    groups,
    setGroups,
    addGroup,
    removeGroup,
    updateGroup,
  };

  return (
    <GroupContext.Provider value={context}>
      {props.children}
    </GroupContext.Provider>
  );
};

export default GroupContextProvider;
