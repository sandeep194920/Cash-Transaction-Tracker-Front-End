import { View, Text } from "react-native";
import React from "react";
import { commonStyles } from "@/commonStyles";
import { currency } from "@/constants/Generic";
import CustomIcon from "../CustomIcon";
import MenuOptionsOnCard from "../Menu";
import { useThemeContext } from "@/context/ThemeContext";
import useMenu from "@/hooks/useMenu";

type ItemCardT = {
  name: string;
  price: number;
  quantity: number;
  itemNumber: number;
};

const ItemCard = ({ itemNumber, name, price, quantity }: ItemCardT) => {
  const { theme } = useThemeContext();
  const { isMenuVisible, showMenu, hideMenu } = useMenu();

  const onEditItem = () => {
    alert("Editting item");
    hideMenu();
  };
  const onDeleteItem = () => {
    alert("Deleting item");
    hideMenu();
  };

  return (
    <View
      style={[
        commonStyles.card,
        { backgroundColor: theme.colors.inputBackground },
      ]}
    >
      {/* Row with Name, Icon, Amount Paid */}
      <View style={[commonStyles.cardRow]}>
        <View style={commonStyles.rowSection}>
          <Text style={[{ color: theme.colors.text }]}>{itemNumber}. </Text>
          <Text style={[{ color: theme.colors.text }]}>{name}</Text>
          <Text style={[{ color: theme.colors.secondaryText }]}>
            {"  "}({price}$ x {quantity})
          </Text>
        </View>
        <View style={commonStyles.rowSection}>
          <CustomIcon
            iconName={currency}
            size={16}
            color={theme.colors.primary}
          />
          <Text style={[{ color: theme.colors.text }]}>
            {price * quantity}{" "}
          </Text>
          <MenuOptionsOnCard
            isMenuVisible={isMenuVisible}
            showMenu={showMenu}
            hideMenu={hideMenu}
            editHandler={onEditItem}
            deleteHandler={onDeleteItem}
          />
        </View>
      </View>
    </View>
  );
};

export default ItemCard;
