import { themes } from "@/constants/Colors";
import React, { createContext, useContext, useState } from "react";

type ThemeT = typeof themes;

type CurrentThemeT = keyof ThemeT;

type ThemeContextT = {
  currentTheme: CurrentThemeT;
  theme: ThemeT[CurrentThemeT];
  switchTheme: (theme: CurrentThemeT) => void;
};

const ThemeContext = createContext<ThemeContextT>({
  currentTheme: "light",
  theme: themes["light"],
  switchTheme: () => {},
});

type ThemeProviderT = {
  children: React.ReactNode;
};

// type ThemeT = ThemeContextT["themeValue"];

const ThemeProvider = ({ children }: ThemeProviderT) => {
  const [currentTheme, setCurrentTheme] = useState<CurrentThemeT>("light");

  const theme = themes[currentTheme];

  const switchTheme = (theme: CurrentThemeT) => {
    setCurrentTheme(theme);
  };

  const appValues = {
    currentTheme,
    theme,
    switchTheme,
  };

  return (
    <ThemeContext.Provider value={appValues}>{children}</ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  return useContext(ThemeContext);
};

export default ThemeProvider;
