import darkTheme from "@/themes/darkTheme";
import { lightTheme } from "@/themes/lightTheme";
import { ThemeProvider } from "@mui/material";
import React, { createContext, useEffect, useState } from "react";

// Define the theme type
type Theme = "light" | "dark";

// Create the theme context
const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
}>({
  theme: "light",
  setTheme: () => {},
});

export const useThemeChanger = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeChanger must be used within a ThemeChanger");
  }
  return context;
};

// Create the theme provider component
export const ThemeChanger: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>("light");

  const handleSetTheme = (newTheme: Theme) => {
    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
  };

  // Load the theme from local storage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme as Theme);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme }}>
      <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeChanger;
