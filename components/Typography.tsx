import { StyleProp, StyleSheet, Text, TextStyle, View } from "react-native";
import React, { PropsWithChildren } from "react";
import { useThemeContext } from "@/context/ThemeContext";
import { ColorsT } from "@/constants/Colors";

type TypographyT = {
  textCenter?: boolean;
  fontSize?: "small" | "base" | "medium" | "large" | "heading" | "caption";
  fontWeight?: "bold" | "regular";
  color?: ColorsT;
  customStyle?: StyleProp<TextStyle>;
};

const Typography: React.FC<PropsWithChildren & TypographyT> = ({
  children,
  textCenter,
  fontSize,
  fontWeight,
  color,
  customStyle,
}) => {
  const { theme } = useThemeContext();

  let fontSizeTranslated: number;
  switch (fontSize) {
    case "caption":
      fontSizeTranslated = 10;
      break;
    case "small":
      fontSizeTranslated = 12;
      break;
    case "base":
      fontSizeTranslated = 14;
      break;
    case "medium":
      fontSizeTranslated = 16;
      break;
    case "large":
      fontSizeTranslated = 18;
      break;
    case "heading":
      fontSizeTranslated = 20;
      break;
    default:
      fontSizeTranslated = 14;
  }

  const styles: StyleProp<TextStyle> = {
    color: color ? color : theme.colors.text,
    fontSize: fontSize ? fontSizeTranslated : 14,
    fontWeight: fontWeight ? fontWeight : "regular",
    textAlign: textCenter ? "center" : "auto",
  };

  return <Text style={[styles, customStyle]}>{children}</Text>;
};

export default Typography;

const styles = StyleSheet.create({});
