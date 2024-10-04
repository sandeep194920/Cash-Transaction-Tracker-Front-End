import React from "react";
import { Stack, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { useAuthContext } from "@/context/AuthContext";
import { Button, SafeAreaView } from "react-native";
import { Drawer } from "expo-router/drawer";

const HomeLayout = () => {
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

const AuthenticatedLayout = () => {
  return <HomeLayout />;
};

const AppLayout = () => {
  const { isLoggedIn, authenticateUser } = useAppContext();
  console.log("Applayout - isLoggedin", isLoggedIn);

  if (isLoggedIn) return <AuthenticatedLayout />;

  return (
    <SafeAreaView>
      <Drawer.Screen />
      <Button title="Login" onPress={() => authenticateUser()} />
    </SafeAreaView>
  );
};

export default AppLayout;
