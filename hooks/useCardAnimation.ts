import { useThemeContext } from "@/context/ThemeContext";
import { useRef, useEffect, useMemo, useCallback } from "react";
import { Animated } from "react-native";

type useCardAnimationT = {
  shouldFlash: boolean;
  shouldLoop: boolean;
  scaleDuration?: number;
  borderDuration?: number;
  animationType: "scale" | "border" | "scale-border";
};

/**
 * Custom hook for handling scale and border animations with optional looping and flashing effects.
 * The hook supports different animation types: "scale", "border", or "scale-border".
 *
 * @param {Object} params - The configuration for the animation.
 * @param {boolean} params.shouldFlash - Determines whether the animation should be triggered (flashed).
 * @param {boolean} params.shouldLoop - Determines whether the animation should loop indefinitely.
 * @param {number} [params.scaleDuration=200] - The duration of the scale animation in milliseconds.
 * @param {number} [params.borderDuration=500] - The duration of the border animation in milliseconds.
 * @param {'scale'|'border'|'scale-border'} params.animationType - The type of animation to apply. Can be one of: "scale", "border", or "scale-border".
 *
 * @returns {Object} The result object containing the following:
 * @returns {Animated.Value} borderColor - An animated value representing the interpolated border color (based on `borderAnim`).
 * @returns {Animated.Value} scaleAnim - An animated value representing the scaling animation (based on `scaleAnim`).
 *
 * @example
 * const { borderColor, scaleAnim } = useCardAnimation({
 *   shouldFlash: true,
 *   shouldLoop: false,
 *   scaleDuration: 300,
 *   borderDuration: 600,
 *   animationType: 'scale-border'
 * });
 */
const useCardAnimation = ({
  shouldFlash,
  shouldLoop,
  scaleDuration = 200,
  borderDuration = 500,
  animationType,
}: useCardAnimationT) => {
  const { theme } = useThemeContext();

  // Refs for animation values
  const scaleAnim = useRef(new Animated.Value(1)).current; // Scale animation
  const borderAnim = useRef(new Animated.Value(0)).current; // Border animation

  // Interpolate border color from animation value
  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.inputBackground, theme.colors.primary], // Flash between two colors
  });

  const scaleAnimation = (value: number) =>
    Animated.timing(scaleAnim, {
      toValue: value, // Scale up/down
      duration: scaleDuration,
      useNativeDriver: true,
    });

  const borderAnimation = (value: number) =>
    Animated.timing(borderAnim, {
      toValue: value, // Change border color
      duration: borderDuration,
      useNativeDriver: false,
    });

  const scaleAnimations: Array<Animated.CompositeAnimation> = [
    scaleAnimation(1.1),
    scaleAnimation(1),
  ];
  const borderAnimations: Array<Animated.CompositeAnimation> = [
    borderAnimation(1),
    borderAnimation(0),
  ];

  const animations = () => {
    switch (animationType) {
      case "scale":
        return scaleAnimations;
      case "border":
        return borderAnimations;
      case "scale-border":
      default:
        return [...scaleAnimations, ...borderAnimations];
    }
  };

  // useEffect(() => {
  //   if (!shouldFlash) return;
  //   const animationSequence = Animated.sequence(animations());
  //   if (shouldLoop) {
  //     Animated.loop(animationSequence).start();
  //   } else {
  //     animationSequence.start();
  //   }
  // }, [shouldFlash, shouldLoop, animations, scaleAnim, borderAnim]);

  useEffect(() => {
    if (!shouldFlash) return;

    const animationSequence = Animated.sequence(animations());

    let animationLoop: Animated.CompositeAnimation | null = null;

    if (shouldLoop) {
      animationLoop = Animated.loop(animationSequence);
      animationLoop.start();
    } else {
      animationSequence.start();
    }

    // TODO: Investigate why adding a cleanup function will cause animation to misbehave
  }, [shouldLoop, shouldFlash]);

  return {
    borderColor,
    scaleAnim,
  };
};

export default useCardAnimation;
