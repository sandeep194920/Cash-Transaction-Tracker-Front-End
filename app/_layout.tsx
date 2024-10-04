import React, { useEffect, useState } from "react";
import Drawer from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, SafeAreaView } from "react-native";
import AuthProvider, { useAuthContext } from "@/context/AuthContext";

const AuthenticatedLayout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerShown: false,
        }}
      >
        <Drawer.Screen name="(app)" />
      </Drawer>
    </GestureHandlerRootView>
  );
};

const UnAuthenticatedLayout = () => {
  const { authenticateUser } = useAuthContext();

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
    <AuthProvider>
      <Layout />
    </AuthProvider>
  );
};

export default RootLayout;
