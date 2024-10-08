import { themes } from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

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

const ThemeProvider = ({ children }: ThemeProviderT) => {
  const [currentTheme, setCurrentTheme] = useState<CurrentThemeT>("dark");

  const theme = themes[currentTheme];

  const switchTheme = (theme: CurrentThemeT) => {
    setCurrentTheme(theme);
    AsyncStorage.setItem("theme", theme);
  };

  // Fetch theme from AsyncStorage when the app loads
  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await AsyncStorage.getItem("theme");
      if (storedTheme && themes[storedTheme as CurrentThemeT]) {
        setCurrentTheme(storedTheme as CurrentThemeT);
      }
    };

    loadTheme(); // Call the function to load the theme
  }, []);

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
