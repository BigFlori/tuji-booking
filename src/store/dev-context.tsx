import React from "react";

interface IDevContextObject {
  devMode: boolean;
  setDevMode: (mode: boolean) => void;
}

export const DevContext = React.createContext<IDevContextObject>({
  devMode: false,
  setDevMode: () => {},
});

export const useDevContext = () => {
  return React.useContext(DevContext);
};

export const useIsDevMode = () => {
  return React.useContext(DevContext).devMode;
};

const DevContextProvider: React.FC<{ children: React.ReactNode }> = (props) => {
  const [devMode, setDevMode] = React.useState(false);

  return <DevContext.Provider value={{ devMode, setDevMode }}>{props.children}</DevContext.Provider>;
};

export default DevContextProvider;
