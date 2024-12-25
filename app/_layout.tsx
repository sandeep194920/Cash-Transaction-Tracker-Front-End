import React from "react";
import Drawer from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AuthProvider, { useAuthContext } from "@/context/AuthContext";
import DrawerContent from "@/components/drawer/DrawerContent";
import ThemeProvider from "@/context/ThemeContext";
import Toast from "react-native-toast-message";
import Authentication from "@/components/authentication/Authentication";
import AppProvider from "@/context/AppContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "react-native-get-random-values"; // for uuid for react-native
import Loading from "@/components/Loading";
import { Dimensions } from "react-native";
import PaymentProvider from "@/context/StripeProvider";

const AuthenticatedLayout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerShown: false,
          // drawerStyle: { width: Dimensions.get("window").width / 1.25 },
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
  const { isLoggedIn, isLoading } = useAuthContext();

  if (isLoading) {
    return <Loading />;
  }

  return isLoggedIn ? <AuthenticatedLayout /> : <UnAuthenticatedLayout />;
};

const RootLayout = () => {
  // Reactotron - For network calls
  if (__DEV__) {
    require("../ReactotronConfig");
  }

  const queryClient = new QueryClient();

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppProvider>
            <PaymentProvider>
              <Layout />
            </PaymentProvider>
            <Toast position="top" topOffset={50} />
          </AppProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default RootLayout;
