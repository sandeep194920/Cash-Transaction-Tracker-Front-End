import { StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Menu, MenuDivider, MenuItem } from "react-native-material-menu";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useThemeContext } from "@/context/ThemeContext";

const MenuOptionsOnCard = () => {
  const [visible, setVisible] = useState(false);
  const { theme } = useThemeContext();
  const showMenu = () => setVisible(true);
  const hideMenu = () => setVisible(false);
  return (
    <Menu
      visible={visible}
      anchor={
        <TouchableOpacity onPress={showMenu}>
          <Icon name="more-vert" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      }
      onRequestClose={hideMenu}
    >
      <MenuItem onPress={() => alert("Edit transaction")}>Edit</MenuItem>
      <MenuItem onPress={() => alert("Delete transaction")}>Delete</MenuItem>
      <MenuDivider />
    </Menu>
  );
};

export default MenuOptionsOnCard;

const styles = StyleSheet.create({});
