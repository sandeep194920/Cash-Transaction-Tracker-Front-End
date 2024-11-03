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
import { Stack, useLocalSearchParams } from "expo-router";

const transaction = {
  date: "Wed, 24th Sep",
  items: [
    { name: "Roti", quantity: 20, price: 200 },
    { name: "Curry", quantity: 20, price: 200 },
    { name: "Idli", quantity: 20, price: 200 },
    { name: "Idli", quantity: 20, price: 200 },
    { name: "Idli", quantity: 20, price: 200 },
    { name: "Idli", quantity: 20, price: 200 },
    { name: "Idli", quantity: 20, price: 200 },
    { name: "Idli", quantity: 20, price: 200 },
    { name: "Idli", quantity: 20, price: 200 },
    { name: "Idli", quantity: 20, price: 200 },
    { name: "Idli", quantity: 20, price: 200 },
    { name: "Idli", quantity: 20, price: 200 },
    { name: "Idli", quantity: 20, price: 200 },
  ],
};

type ItemT = {
  name: string;
  price: number;
  quantity: number;
};

const gross = 100;
const tax = gross * 0.015; // Assuming 1.5% tax
const total = gross + tax;
const amountPaid = 110;
const balance = amountPaid - total;

const TransactionDetail = () => {
  const { theme } = useThemeContext();
  const { transactionDate } = useLocalSearchParams();
  const gross = 100;
  const tax = gross * 0.015; // Assuming 1.5% tax
  const total = gross + tax;

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
            headerTitle: transactionDate as string,
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
            <Text style={[{ color: theme.colors.text }]}>
              ${price}
              {"   "}
            </Text>
            <MenuOptionsOnCard />
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
        {/* Centered Transaction Date */}
        {/* <View style={styles.dateSection}>
          <Text style={[styles.date, { color: theme.colors.text }]}>
            {transaction.date}
          </Text>
        </View> */}

        {/* List of items using FlatList */}
        <FlatList
          data={transaction.items}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          //   contentContainerStyle={styles.listContainer}
        />
      </View>

      {/* Gross, Tax, and Total section at the bottom */}
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
          <Text style={[styles.amountValue, { color: theme.colors.text }]}>
            ${gross.toFixed(2)}
          </Text>
        </View>
        <View style={commonStyles.cardRow}>
          <Text
            style={[styles.amountLabel, { color: theme.colors.secondaryText }]}
          >
            Tax
          </Text>
          <Text style={[styles.amountValue, { color: theme.colors.text }]}>
            ${tax.toFixed(2)}
          </Text>
        </View>
        <View style={commonStyles.cardRow}>
          <Text style={[styles.totalLabel, { color: theme.colors.text }]}>
            Total
          </Text>
          <Text style={[styles.totalValue, { color: theme.colors.text }]}>
            ${total.toFixed(2)}
          </Text>
        </View>

        {/* New thinner separator below total */}
        <View style={styles.thinSeparator} />

        {/* Amount Paid and Balance section */}
        <View style={commonStyles.cardRow}>
          <Text
            style={[styles.smallLabel, { color: theme.colors.secondaryText }]}
          >
            Amount Paid
          </Text>
          <Text style={[styles.smallValue, { color: theme.colors.text }]}>
            ${amountPaid.toFixed(2)}
          </Text>
        </View>
        <View style={commonStyles.cardRow}>
          <Text
            style={[styles.smallLabel, { color: theme.colors.secondaryText }]}
          >
            Balance (after this order)
          </Text>
          <Text style={[styles.smallValue, { color: theme.colors.text }]}>
            ${balance?.toFixed(2)}
          </Text>
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
  },
});

export default TransactionDetail;
