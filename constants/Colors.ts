/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

// Theme-based colors (dark/light)

export const colors = {
  yellow_shade_1: "#F5C518",
  yellow_shade_2: "#e4ce75",

  // yellow_shade_2: "#DA9B1A",
  orange_shade_1: "#ED7738",
  orange_shade_2: "#e6986e",
  black: "#000000",
  white: "#FFFFFF",
  grey_shade_1: "#1C1C1C",
  grey_shade_2: "#282828",
  grey_shade_3: "#707070",
  grey_shade_4: "#B0B0B0",
  grey_shade_5: "#E0E0E0",
  grey_shade_6: "#F7F7F7",
  grey_shade_7: "#fffcfc",
  red_shade_1: "#f46b6f",
  red_shade_2: "#ff1a05",
  green_shade_1: "#00fe11",
  green_shade_2: "#186a02",
  blue_shade_1: "#4267B2",
} as const;

export type ColorsT = (typeof colors)[keyof typeof colors];

type SocialButtonT = {
  color: string;
  background: string;
};

type ColorsCategoryT = {
  primary: ColorsT;
  primaryLight: ColorsT;
  background: ColorsT;
  text: ColorsT;
  success: ColorsT;
  error: ColorsT;
  secondaryText: ColorsT;
  lightText: ColorsT;
  inputBackground: ColorsT;
  border: ColorsT;
  buttonText: ColorsT;
  socialButtons: {
    google: SocialButtonT;
    fb: SocialButtonT;
  };
};
type ThemeT = {
  colors: ColorsCategoryT;
};

export const themes: Record<"dark" | "light", ThemeT> = {
  dark: {
    colors: {
      primary: colors.yellow_shade_1,
      primaryLight: colors.yellow_shade_2,
      background: colors.black,
      text: colors.white,
      success: colors.green_shade_1,
      error: colors.red_shade_1,
      secondaryText: colors.grey_shade_3,
      lightText: colors.grey_shade_6,
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
      primaryLight: colors.orange_shade_2,
      background: colors.white,
      text: colors.black,
      error: colors.red_shade_2,
      success: colors.green_shade_2,
      secondaryText: colors.grey_shade_3,
      lightText: colors.grey_shade_1,
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
