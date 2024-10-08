import React from "react";
import Drawer from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthProvider, { useAuthContext } from "@/context/AuthContext";
import DrawerContent from "@/components/drawer/DrawerContent";
import ThemeProvider from "@/context/ThemeContext";
import Toast from "react-native-toast-message";
import Authentication from "@/components/authentication/Authentication";

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
  return <Authentication />;
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
        <Toast position="top" topOffset={50} />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default RootLayout;
