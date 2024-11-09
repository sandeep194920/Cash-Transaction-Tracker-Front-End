import { StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Menu, MenuDivider, MenuItem } from "react-native-material-menu";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useThemeContext } from "@/context/ThemeContext";
import { MenuT } from "@/types";

const MenuOptionsOnCard = ({
  isMenuVisible,
  showMenu,
  hideMenu,
  editHandler,
  deleteHandler,
}: MenuT) => {
  const { theme } = useThemeContext();

  return (
    <Menu
      visible={isMenuVisible}
      anchor={
        <TouchableOpacity onPress={showMenu}>
          <Icon name="more-vert" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      }
      onRequestClose={hideMenu}
    >
      <MenuItem onPress={editHandler}>Edit</MenuItem>
      <MenuItem onPress={deleteHandler}>Delete</MenuItem>
      <MenuDivider />
    </Menu>
  );
};

export default MenuOptionsOnCard;

const styles = StyleSheet.create({});
