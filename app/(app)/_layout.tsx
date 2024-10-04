import React from "react";
import { Stack, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { Button, SafeAreaView } from "react-native";
import { Drawer } from "expo-router/drawer";

const AppLayout = () => {
  const nav = useNavigation();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Home",
          headerLeft: () => {
            return (
              <Ionicons
                name="menu"
                size={24}
                onPress={() => {
                  nav.dispatch(DrawerActions.openDrawer);
                }}
              />
            );
          },
        }}
      />
    </Stack>
  );
};

export default AppLayout;
