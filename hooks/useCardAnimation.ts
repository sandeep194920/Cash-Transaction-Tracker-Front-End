import { useThemeContext } from "@/context/ThemeContext";
import { useRef, useEffect } from "react";
import { Animated } from "react-native";

const useCardAnimation = (isNewlyAddedItem = false) => {
  const { theme } = useThemeContext();

  // Refs for animation values
  const scaleAnim = useRef(new Animated.Value(1)).current; // Scale animation
  const borderAnim = useRef(new Animated.Value(0)).current; // Border animation

  // Interpolate border color from animation value
  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.inputBackground, theme.colors.primary], // Flash between two colors
  });

  useEffect(() => {
    // Trigger animation on mount or when card becomes visible
    if (!isNewlyAddedItem) return;
    // triggger animation only for newly added item
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1, // Scale up
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1, // Scale down
        duration: 200,
        useNativeDriver: true,
      }),
      // Flash the border color
      Animated.timing(borderAnim, {
        toValue: 1, // Change border color
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.timing(borderAnim, {
        toValue: 0, // Revert border color
        duration: 500,
        useNativeDriver: false,
      }),
    ]).start();
  }, []);
  return {
    borderColor,
    scaleAnim,
  };
};

export default useCardAnimation;
