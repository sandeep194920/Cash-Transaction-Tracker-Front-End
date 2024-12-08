import { useThemeContext } from "@/context/ThemeContext";
import { StyleProp, StyleSheet, TextStyle } from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";
import Fontisto from "react-native-vector-icons/Fontisto";
import FA from "react-native-vector-icons/FontAwesome";
import FA5 from "react-native-vector-icons/FontAwesome5";
import { ColorsT } from "@/constants/Colors";
import { IconNameT } from "@/types";

type CustomIconT = {
  iconName: IconNameT;
  size: number;
  color: ColorsT;
  marginRight?: number;
  marginLeft?: number;
  onPress?: () => void;
  additionalStyles?: StyleProp<TextStyle>;
};

const CustomIcon = ({
  iconName,
  size,
  color,
  marginRight,
  marginLeft,
  onPress,
  additionalStyles,
}: CustomIconT) => {
  // Is shown next to Balance Amount in the customer's transactions' list as this is a bit bolder icon that matches the bold heading text
  // hence not using the attach-money icon name here
  if (iconName === "dollar") {
    return (
      <FA
        onPress={onPress}
        name={iconName}
        size={size}
        color={color}
        style={[
          additionalStyles,
          {
            marginRight: marginRight || -2,
            marginLeft: marginLeft || -2,
          },
        ]}
      />
    );
  }

  return (
    <MaterialIcon
      onPress={onPress}
      name={iconName}
      size={size}
      color={color}
      style={[
        additionalStyles,
        {
          marginRight: marginRight || -2,
          marginLeft: marginLeft || -2,
        },
      ]}
    />
  );
};

export default CustomIcon;

const styles = StyleSheet.create({
  icon: {},
});
