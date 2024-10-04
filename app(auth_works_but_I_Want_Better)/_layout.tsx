import React, { useEffect, useState } from "react";
import Drawer from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import AppProvider from "@/context/AppContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RootLayout = () => {
  return (
    <AppProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer
          screenOptions={{
            headerShown: false,
          }}
        >
          <Drawer.Screen name="(app)" />
        </Drawer>
      </GestureHandlerRootView>
    </AppProvider>
  );
};

export default RootLayout;
