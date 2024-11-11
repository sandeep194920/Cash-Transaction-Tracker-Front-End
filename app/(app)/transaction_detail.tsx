import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ListRenderItemInfo,
} from "react-native";
import { useThemeContext } from "@/context/ThemeContext";
import MenuOptionsOnCard from "@/components/Menu";
import { commonStyles } from "@/commonStyles";
import { Stack } from "expo-router";
import { useAppContext } from "@/context/AppContext";
import { formattedDateStr } from "@/utils/dateTime";
import CustomIcon from "@/components/CustomIcon";
import { currency } from "@/constants/Generic";

type ItemT = {
  name: string;
  price: number;
  quantity: number;
};

const TransactionDetail = () => {
  const { theme } = useThemeContext();

  const { currentSelectedTransaction } = useAppContext();

  if (!currentSelectedTransaction) return null;

  const {
    transactionDate,
    amountPaid,
    balanceAmount,
    taxPercentage,
    grossPrice,
    totalPrice,
    items,
  } = currentSelectedTransaction;

  const { dateShort } = formattedDateStr(transactionDate);

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
        <Stack.Screen
          options={{
            headerTitle: dateShort,
          }}
        />
        {/* Row with Name, Icon, Amount Paid */}
        <View style={[commonStyles.cardRow]}>
          <View style={commonStyles.rowSection}>
            <Text style={[{ color: theme.colors.text }]}>{index + 1}. </Text>
            <Text style={[{ color: theme.colors.text }]}>{name}</Text>
            <Text style={[{ color: theme.colors.secondaryText }]}>
              {"  "}(x {quantity})
            </Text>
          </View>
          <View style={commonStyles.rowSection}>
            <CustomIcon
              iconName={currency}
              color={theme.colors.primary}
              size={16}
            />
            <Text style={[{ color: theme.colors.text }]}>
              {price}
              {"   "}
            </Text>
            {/* Enable MenuOptions card in v2 so user can edit/delete the items */}
            {/* <MenuOptionsOnCard /> */}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={[commonStyles.flex1]}>
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          //   contentContainerStyle={styles.listContainer}
        />
      </View>

      <View
        style={[
          commonStyles.card,
          styles.bottomSection,
          { backgroundColor: theme.colors.inputBackground },
        ]}
      >
        <View style={styles.separator} />
        <View style={commonStyles.cardRow}>
          <Text
            style={[styles.amountLabel, { color: theme.colors.secondaryText }]}
          >
            Gross
          </Text>
          <View style={commonStyles.rowSection}>
            <CustomIcon
              iconName={currency}
              color={theme.colors.primary}
              size={16}
            />
            <Text style={[styles.amountValue, { color: theme.colors.text }]}>
              {grossPrice.toFixed(2)}
            </Text>
          </View>
        </View>
        <View style={commonStyles.cardRow}>
          <Text
            style={[styles.amountLabel, { color: theme.colors.secondaryText }]}
          >
            Tax
          </Text>
          <View style={commonStyles.rowSection}>
            <Text style={[styles.amountValue, { color: theme.colors.text }]}>
              {taxPercentage}
            </Text>
            <CustomIcon
              iconName="percent"
              color={theme.colors.primary}
              size={16}
              marginLeft={0.01}
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
              color={theme.colors.primary}
              size={16}
            />
            <Text style={[styles.totalValue, { color: theme.colors.text }]}>
              {totalPrice.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* New thinner separator below total */}
        <View style={styles.thinSeparator} />

        {/* Amount Paid and Balance section */}
        <View style={commonStyles.cardRow}>
          <Text
            style={[styles.smallLabel, { color: theme.colors.secondaryText }]}
          >
            Amount Paid for this order
          </Text>
          <View style={commonStyles.rowSection}>
            <CustomIcon
              iconName={currency}
              color={theme.colors.primary}
              size={16}
            />
            <Text style={[styles.smallValue, { color: theme.colors.text }]}>
              {amountPaid.toFixed(2)}
            </Text>
          </View>
        </View>
        <View style={commonStyles.cardRow}>
          <Text
            style={[styles.smallLabel, { color: theme.colors.secondaryText }]}
          >
            {balanceAmount >= 0 ? "Balance Amount" : "Overpaid Amount"} (after
            this order)
          </Text>
          <View style={commonStyles.rowSection}>
            <CustomIcon
              iconName={currency}
              color={
                balanceAmount > 0 ? theme.colors.error : theme.colors.success
              }
              size={16}
            />
            <Text
              style={[
                styles.smallValue,
                {
                  color:
                    balanceAmount > 0
                      ? theme.colors.error
                      : theme.colors.success,
                },
              ]}
            >
              {Math.abs(balanceAmount).toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 20,
    justifyContent: "center",
  },
  listContainer: {
    paddingBottom: 16,
  },
  dateSection: {
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  date: {
    fontSize: 20,
    fontWeight: "bold",
  },
  itemName: {
    fontSize: 16,
  },
  itemPrice: {
    fontSize: 16,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    marginBottom: 10,
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
    fontWeight: "600",
  },
});

export default TransactionDetail;
