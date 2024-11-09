import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ListRenderItemInfo,
  SafeAreaView,
} from "react-native";
import { useThemeContext } from "@/context/ThemeContext";
import MenuOptionsOnCard from "@/components/Menu";
import { commonStyles } from "@/commonStyles";
import { router } from "expo-router";
import Button from "@/components/Button";
import { ItemT } from "@/types";
import { useAppContext } from "@/context/AppContext";
import DatePicker from "@/components/DateSelection";
import Toast from "react-native-toast-message";
import CustomIcon from "@/components/CustomIcon";
import { currency } from "@/constants/Generic";
import { useMemo } from "react";
import useTransaction from "@/hooks/useTransaction";
import useTransactions from "@/hooks/useTransactions";

const AddTransactionScreen = () => {
  const { theme } = useThemeContext();
  const {
    taxPercentage,
    unsettledTransaction: { items: orderedItems },
  } = useAppContext();

  const { orderGrossAmount, orderTotalAmount } = useTransaction();

  const renderItem = ({ ...props }: ListRenderItemInfo<ItemT>) => {
    const {
      item: { name, price, quantity },
      index,
    } = props;

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
            <Text style={[{ color: theme.colors.text }]}>{index + 1}. </Text>
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
            <MenuOptionsOnCard />
          </View>
        </View>
      </View>
    );
  };

  const addItemHandler = () => {
    router.push("/(app)/add_item");
  };

  const saveTransactionHandler = () => {
    try {
      router.push("/(app)/confirm_transaction");
    } catch (error) {
      console.log("error", error);
      Toast.show({
        type: "error",
        text1: "Something went wrong. Please try again later!",
      });
      return;
    }
  };

  return (
    <SafeAreaView
      style={[commonStyles.flex1, { backgroundColor: theme.colors.background }]}
    >
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={[commonStyles.flex1]}>
          {!orderedItems?.length ? (
            <DatePicker />
          ) : (
            <View style={[styles.dateSection]}>
              <DatePicker />
            </View>
          )}

          {/* List of items using FlatList */}
          {!orderedItems?.length ? (
            <View style={[commonStyles.placeAtCenter, { gap: 20 }]}>
              <Button
                title="Add First Item"
                width={140}
                height={40}
                fontSize={14}
                color={theme.colors.primary}
                textColor={theme.colors.buttonText}
                pressHandler={addItemHandler}
              />
            </View>
          ) : (
            <FlatList
              data={orderedItems}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          )}
        </View>

        {/* Gross, Tax, and Total section at the bottom */}
        <View
          style={[
            commonStyles.card,
            styles.bottomSection,
            { backgroundColor: theme.colors.inputBackground },
          ]}
        >
          <View style={commonStyles.separator} />
          <View style={commonStyles.cardRow}>
            <Text
              style={[
                styles.amountLabel,
                { color: theme.colors.secondaryText },
              ]}
            >
              Gross
            </Text>
            <View style={commonStyles.rowSection}>
              <CustomIcon
                iconName={currency}
                size={16}
                color={theme.colors.primary}
              />
              <Text style={[styles.amountValue, { color: theme.colors.text }]}>
                {orderGrossAmount}
              </Text>
            </View>
          </View>
          <View style={commonStyles.cardRow}>
            <Text
              style={[
                styles.amountLabel,
                { color: theme.colors.secondaryText },
              ]}
            >
              Tax
            </Text>
            <View style={commonStyles.rowSection}>
              <Text style={[styles.amountValue, { color: theme.colors.text }]}>
                {Number.isInteger(taxPercentage)
                  ? taxPercentage
                  : taxPercentage.toFixed(2)}
              </Text>
              <CustomIcon
                iconName="percent"
                size={16}
                color={theme.colors.primary}
                marginLeft={2}
              />
            </View>
          </View>
          <View style={commonStyles.cardRow}>
            <Text style={[styles.totalLabel, { color: theme.colors.text }]}>
              Total
            </Text>
            <View style={commonStyles.rowSection}>
              <CustomIcon
                iconName={currency}
                size={16}
                color={theme.colors.primary}
              />
              <Text style={[styles.totalValue, { color: theme.colors.text }]}>
                {orderTotalAmount}
              </Text>
            </View>
          </View>
        </View>
        {orderedItems?.length ? (
          <View style={{ gap: 20 }}>
            <Button
              title="Add Next Item"
              fontSize={16}
              color={theme.colors.primary}
              textColor={theme.colors.buttonText}
              pressHandler={addItemHandler}
            />
            <Button
              title="Save Transaction"
              fontSize={16}
              color={theme.colors.primary}
              textColor={theme.colors.buttonText}
              pressHandler={saveTransactionHandler}
            />
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 20,
  },
  listContainer: {
    paddingBottom: 16,
  },
  dateSection: {
    flexDirection: "row",
    // justifyContent: "space-between",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  date: {
    fontSize: 16,
    fontWeight: "bold",
  },
  item: {
    fontSize: 16,
  },
  bottomSection: {
    padding: 10,
    marginVertical: 16,
  },
  amountLabel: {
    fontSize: 14,
  },
  amountValue: {
    fontSize: 14,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  thinSeparator: {
    borderBottomWidth: 0.5, // Thinner line below total
    borderBottomColor: "#E0E0E0",
    marginVertical: 10,
  },

  smallLabel: {
    fontSize: 12, // Smaller text for Amount Paid and Balance
  },
  smallValue: {
    fontSize: 12,
  },
});

export default AddTransactionScreen;
