import { Animated } from "react-native";
import React from "react";
import { useThemeContext } from "@/context/ThemeContext";
import { ColorsT } from "@/constants/Colors";

type AnimatedViewT = {
  borderColor: Animated.AnimatedInterpolation<string | number>;
  scaleAnim: Animated.Value;
  children: React.ReactNode;
  backgroundColor?: ColorsT;
};

const AnimatedView = ({
  backgroundColor,
  borderColor,
  scaleAnim,
  children,
}: AnimatedViewT) => {
  const { theme } = useThemeContext();
  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleAnim }], // Scale animation (native)
          backgroundColor: theme.colors.inputBackground,
          borderRadius: 10,
        },
      ]}
    >
      <Animated.View
        style={{
          borderColor: borderColor,
          borderWidth: 2,
          borderRadius: 10,
        }}
      >
        {children}
      </Animated.View>
    </Animated.View>
  );
};

export default AnimatedView;
