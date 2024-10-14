import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { ColorsT } from "@/constants/Colors";

type ButtonT = {
  title: string;
  color?: ColorsT;
  textColor: ColorsT;
  fontSize?: number;
  borderColor?: ColorsT;
  width?: number;
  height?: number;
  pressHandler: () => void;
};

const Button = ({
  color,
  textColor,
  title,
  borderColor,
  width,
  height,
  fontSize = 18,
  pressHandler,
}: ButtonT) => {
  const buttonStyles = [
    styles.button,
    color ? { backgroundColor: color } : null,
    borderColor
      ? {
          borderWidth: 1,
          borderColor: borderColor,
        }
      : null,
    width ? { width } : null,
    height ? { height } : null,
  ];

  const textStyles = [
    styles.buttonText,
    textColor ? { color: textColor } : null,
    fontSize ? { fontSize } : { fontSize: 18 },
  ];

  return (
    <TouchableOpacity onPress={pressHandler} style={buttonStyles}>
      <Text style={textStyles}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "bold",
  },
});
