import React from "react";
import Group from "@/models/group-model";

type GroupsContextObject = {
  groups: Group[];
  setGroups: (groups: Group[]) => void;
  addGroup: (group: Group) => void;
  removeGroup: (id: number) => void;
  updateGroup: (id: number, group: Group) => void;
};

export const GroupsContext = React.createContext<GroupsContextObject>({
  groups: [],
  setGroups: () => {},
  addGroup: () => {},
  removeGroup: () => {},
  updateGroup: () => {},
});

const GroupsContextProvider: React.FC<{ children: React.ReactNode }> = (
  props
) => {
  const [groups, setGroups] = React.useState<Group[]>([
    { id: 1, title: "Group 1" },
    { id: 2, title: "Group 2" },
    { id: 3, title: "Group 3" },
    { id: 4, title: "Group 4" },
    { id: 5, title: "Group 5" },
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
    <GroupsContext.Provider value={context}>
      {props.children}
    </GroupsContext.Provider>
  );
};

export default GroupsContextProvider;
