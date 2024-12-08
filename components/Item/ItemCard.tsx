import { View, Text } from "react-native";
import React from "react";
import { commonStyles } from "@/commonStyles";
import { currency } from "@/constants/Generic";
import CustomIcon from "../CustomIcon";
import MenuOptionsOnCard from "../Menu";
import { useThemeContext } from "@/context/ThemeContext";
import useMenu from "@/hooks/useMenu";
import { router } from "expo-router";
import { useAppContext } from "@/context/AppContext";

type ItemCardT = {
  name: string;
  price: number;
  quantity: number;
  itemNumber: number;
  id: string;
};

const ItemCard = ({
  itemNumber,
  name,
  price,
  quantity,
  id: itemID,
}: ItemCardT) => {
  const { theme } = useThemeContext();
  const { isMenuVisible, showMenu, hideMenu } = useMenu();
  const { deleteItem } = useAppContext();

  const onEditItem = () => {
    //TODO: For some reason, if I don't put it in setTimeout, the /app/add_item page
    // will open and then due to hideMenu() it closes immediately. I need to look into it.

    // Acceptance criteria: Once the hideMenu is executed, without setTimeout I should be able to push the route to add_item
    hideMenu();
    setTimeout(() => {
      router.push({ pathname: "/(app)/add_item", params: { itemID } });
    }, 500);
  };
  const onDeleteItem = () => {
    hideMenu();
    setTimeout(() => {
      deleteItem({ itemID });
    }, 500);
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
