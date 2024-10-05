import React from "react";
import { Stack, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { useThemeContext } from "@/context/ThemeContext";

const AppLayout = () => {
  const nav = useNavigation();
  const { theme } = useThemeContext();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTintColor: theme.colors.buttonText,
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },

          headerTitle: "Home",
          headerLeft: () => {
            return (
              <Ionicons
                name="menu"
                color={theme.colors.buttonText}
                size={24}
                onPress={() => {
                  nav.dispatch(DrawerActions.openDrawer);
                }}
              />
            );
          },
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          headerTitle: "Settings",
          headerTintColor: theme.colors.buttonText,
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
        }}
      />
    </Stack>
  );
};

export default AppLayout;
