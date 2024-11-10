import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Stack, router } from "expo-router";
import Icon from "react-native-vector-icons/AntDesign";
import { useThemeContext } from "@/context/ThemeContext";

type HeaderLeftBackArrowT = {
  onPress?: () => void;
};

const HeaderLeftBackArrow = ({ onPress }: HeaderLeftBackArrowT) => {
  const { theme } = useThemeContext();

  const arrowLeftHandler = () => {
    console.log("The onPress is", onPress);
    if (onPress) {
      onPress();
      return;
    }
    router.dismiss();
  };

  return (
    <Stack.Screen
      options={{
        headerLeft: () => (
          <TouchableOpacity
            onPress={arrowLeftHandler}
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
