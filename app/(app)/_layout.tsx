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

          headerTitle: "Customers",
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
        name="customer_transactions_list"
        options={{
          headerTintColor: theme.colors.buttonText,
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTitle: "Transactions",
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

      <Stack.Screen
        name="add_customer"
        options={{
          presentation: "modal",
          headerTitle: "Add New Customer",
          headerTintColor: theme.colors.buttonText,
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
        }}
      />

      <Stack.Screen
        name="edit_customer"
        options={{
          presentation: "modal",
          headerTitle: "Edit Customer",
          headerTintColor: theme.colors.buttonText,
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
        }}
      />

      <Stack.Screen
        name="transaction_detail"
        options={{
          headerTintColor: theme.colors.buttonText,
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
        }}
      />

      <Stack.Screen
        name="add_item"
        options={{
          presentation: "modal",
          headerTitle: "Add Item",
          headerTintColor: theme.colors.buttonText,
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
        }}
      />

      <Stack.Screen
        name="add_transaction"
        options={{
          headerTitle: "New Transaction",
          headerTintColor: theme.colors.buttonText,
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
        }}
      />

      <Stack.Screen
        name="confirm_transaction"
        options={{
          presentation: "modal",
          headerTitle: "Confirm Transaction",
          headerTintColor: theme.colors.buttonText,
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
        }}
      />

      <Stack.Screen
        name="balance_adjust"
        options={{
          presentation: "modal",
          headerTitle: "Adjust Balance",
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
