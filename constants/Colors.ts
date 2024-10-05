/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

// Theme-based colors (dark/light)

const colors = {
  yellow_shade_1: "#F5C518",
  orange_shade_1: "#ED7738",
  black: "#000000",
  white: "#FFFFFF",
  grey_shade_1: "#1C1C1C",
  grey_shade_2: "#303030",
  grey_shade_3: "#707070",
  grey_shade_4: "#B0B0B0",
  grey_shade_5: "#E0E0E0",
  grey_shade_6: "#F7F7F7",
  red_shade_1: "#ff4838",
  blue_shade_1: "#4267B2",
};

export const themes = {
  dark: {
    colors: {
      primary: colors.yellow_shade_1,
      background: colors.black,
      text: colors.white,
      error: colors.red_shade_1,
      secondaryText: colors.grey_shade_3,
      inputBackground: colors.grey_shade_1,
      border: colors.grey_shade_2,
      buttonText: colors.black,
      socialButtons: {
        google: {
          color: colors.white,
          background: colors.red_shade_1,
        },
        fb: {
          color: colors.white,
          background: colors.blue_shade_1,
        },
      },
    },
  },
  light: {
    colors: {
      primary: colors.orange_shade_1,
      background: colors.white,
      text: colors.black,
      error: colors.red_shade_1,
      secondaryText: colors.grey_shade_3,
      inputBackground: colors.grey_shade_6,
      border: colors.grey_shade_5,
      buttonText: colors.white,
      socialButtons: {
        google: {
          color: colors.white,
          background: colors.red_shade_1,
        },
        fb: {
          color: colors.white,
          background: colors.blue_shade_1,
        },
      },
    },
  },
};
