import { themes } from "@/constants/Colors";
import { ThemeOptionsT } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

type ThemeT = typeof themes;

type CurrentThemeT = keyof ThemeT;

type ThemeContextT = {
  currentTheme: ThemeOptionsT;
  theme: ThemeT[CurrentThemeT]; // Always corresponds to either "light" or "dark"
  switchTheme: (theme: CurrentThemeT | "system") => void; // Accept "system" in switchTheme
};

type ThemeProviderT = {
  children: React.ReactNode;
};

// If you want to initialize the context

const ThemeContext = createContext<ThemeContextT>({
  currentTheme: "light",
  theme: themes["light"],
  switchTheme: () => {},
});

// If you don't want to initialize the context
// null as never will allow you to not have to define the initial values
// const ThemeContext = createContext<ThemeContextT>(null as never);

export const themeOptions: ThemeOptionsT[] = [
  "dark",
  "light",
  "system",
] as const;

const ThemeProvider = ({ children }: ThemeProviderT) => {
  const colorScheme = useColorScheme();

  const [currentTheme, setCurrentTheme] = useState<CurrentThemeT | "system">(
    "system"
  );

  const resolvedTheme: CurrentThemeT =
    currentTheme === "system"
      ? colorScheme === "dark"
        ? "dark"
        : "light"
      : currentTheme;

  const theme = themes[resolvedTheme];

  const switchTheme = (theme: CurrentThemeT | "system") => {
    setCurrentTheme(theme);

    if (theme !== "system") {
      AsyncStorage.setItem("theme", theme);
    } else {
      // even though you remove this here, when user had set this to "system" before reloading the app, the useState's default is system so that gets set
      AsyncStorage.removeItem("theme"); // Optional: Clear persisted theme for "system"
    }
  };

  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await AsyncStorage.getItem("theme");
      if (storedTheme === "dark" || storedTheme === "light") {
        setCurrentTheme(storedTheme as CurrentThemeT);
      }
      // No need of else here because if the AsyncStorage.getItem("theme") is null when it is system theme, then
      // useState is already set at the beginning above and resolvedTheme handles that
    };
    loadTheme();
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
