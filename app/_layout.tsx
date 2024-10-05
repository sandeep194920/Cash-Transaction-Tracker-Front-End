import React, { useEffect, useState } from "react";
import Drawer from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, SafeAreaView, useColorScheme } from "react-native";
import AuthProvider, { useAuthContext } from "@/context/AuthContext";
import DrawerContent from "@/components/drawer/DrawerContent";
import ThemeProvider from "@/context/ThemeContext";

const AuthenticatedLayout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerShown: false,
        }}
        drawerContent={DrawerContent}
      >
        <Drawer.Screen name="(app)" />
      </Drawer>
    </GestureHandlerRootView>
  );
};

const UnAuthenticatedLayout = () => {
  const { authenticateUser } = useAuthContext();
  let colorScheme = useColorScheme();

  console.log("Color Scheme", colorScheme);
  return (
    <SafeAreaView>
      <Button
        onPress={() => {
          authenticateUser();
        }}
        title="Login"
      />
    </SafeAreaView>
  );
};

const Layout = () => {
  const { isLoggedIn } = useAuthContext();
  return isLoggedIn ? <AuthenticatedLayout /> : <UnAuthenticatedLayout />;
};

const RootLayout = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default RootLayout;
