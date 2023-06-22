import React from "react";
import Group from "@/models/group/group-model";
import GroupState from "@/models/group/group-state-model";
import GroupType from "@/models/group/group-type-model";

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

const GroupContextProvider: React.FC<{ children: React.ReactNode }> = (props) => {
  const [groups, setGroups] = React.useState<Group[]>([
    {
      id: 1,
      title: "Group 1",
      state: GroupState.ACTIVE,
      type: GroupType.CAR,
      description: "Fehér kisbusz",
    },
    { id: 2, title: "Group 2", state: GroupState.ACTIVE, type: GroupType.DRIVER },
    { id: 3, title: "Group 3", state: GroupState.ACTIVE, type: GroupType.HOUSE },
    { id: 4, title: "Group 4", state: GroupState.SOLD, type: GroupType.CAR },
    { id: 5, title: "Group 5", state: GroupState.IN_SERVICE, type: GroupType.CAR },
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

  return <GroupContext.Provider value={context}>{props.children}</GroupContext.Provider>;
};

export default GroupContextProvider;
