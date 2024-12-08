import { StyleSheet, TouchableOpacity } from "react-native";
import React, { useMemo, useState } from "react";
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
  optionsToBeShown,
}: MenuT) => {
  const { theme } = useThemeContext();

  const options = useMemo(() => {
    if (optionsToBeShown === "EDIT") {
      return <MenuItem onPress={editHandler}>Edit</MenuItem>;
    } else if (optionsToBeShown === "DELETE") {
      return <MenuItem onPress={deleteHandler}>Delete</MenuItem>;
    } else {
      return (
        <>
          <MenuItem onPress={editHandler}>Edit</MenuItem>
          <MenuItem onPress={deleteHandler}>Delete</MenuItem>
          <MenuDivider />
        </>
      );
    }
  }, [optionsToBeShown]);

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
      {options}
    </Menu>
  );
};

export default MenuOptionsOnCard;

const styles = StyleSheet.create({});
