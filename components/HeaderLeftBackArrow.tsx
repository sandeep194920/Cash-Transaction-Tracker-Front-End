import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Stack, router } from "expo-router";
import Icon from "react-native-vector-icons/AntDesign";
import { useThemeContext } from "@/context/ThemeContext";

const HeaderLeftBackArrow = () => {
  const { theme } = useThemeContext();
  return (
    <Stack.Screen
      options={{
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => router.dismiss()}
            style={{ marginRight: 10 }}
          >
            <Icon name="arrowleft" size={24} color={theme.colors.buttonText} />
          </TouchableOpacity>
        ),
      }}
    />
  );
};

export default HeaderLeftBackArrow;
