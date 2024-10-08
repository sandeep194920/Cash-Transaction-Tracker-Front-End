import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View, Image } from "react-native";
import { useThemeContext } from "@/context/ThemeContext";
import { authStyles } from "./authentication/authStyles";
import { CurrentAuthScreenT } from "./authentication/Authentication";

const Loading = () => {
  const { theme } = useThemeContext();
  const spinValue = useRef(new Animated.Value(0)).current;

  // First, set up the spin animation
  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000, // Duration of one spin in milliseconds
        useNativeDriver: true, // Better performance
      })
    ).start();
  }, [spinValue]);

  // Interpolate the spin animation to rotate from 0 to 360 degrees
  const spin = spinValue.interpolate({
    inputRange: [0, 2],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View
      style={[
        styles.container,
        styles.vertical,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <Animated.Image
        source={require("@/assets/images/icon.png")}
        style={[
          authStyles.logo,
          { transform: [{ rotate: spin }] }, // Apply rotation
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  vertical: {
    flexDirection: "column",
    justifyContent: "space-evenly",
    padding: 10,
  },
});

export default Loading;
