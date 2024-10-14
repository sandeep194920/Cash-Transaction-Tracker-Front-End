import {
  StyleSheet,
  View,
  FlatList,
  ListRenderItemInfo,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { Stack, useLocalSearchParams, Link, router } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useThemeContext } from "@/context/ThemeContext";
import CustomerDetailCard from "@/components/Customers/CustomerDetailCard";
import { TransactionT } from "@/types";

const CustomerDetails = () => {
  const { theme } = useThemeContext();
  const { customerName } = useLocalSearchParams();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [transactions, setTransactions] = useState([
    {
      _id: "1",
      date: "Wed, 3rd Sep 2020",
      price: -10,
      amountPaid: 150,
      balanceAmount: 0,
    },
    {
      _id: "2",
      date: "Mon, 5th Oct 2020",
      price: 100,
      amountPaid: 10,
      balanceAmount: 0,
    },
    {
      _id: "3",
      date: "Mon, 5th Oct 2020",
      price: 100,
      amountPaid: 10,
      balanceAmount: 0,
    },
  ]);

  const renderItem = ({ ...props }: ListRenderItemInfo<TransactionT>) => {
    const { item } = props;
    return (
      <CustomerDetailCard
        item={item}
        expanded={expandedItem === item._id}
        setExpanded={() =>
          setExpandedItem(expandedItem === item._id ? null : item._id)
        }
      />
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: customerName
            ? (customerName as string)
            : "Transaction details",
        }}
      />
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <FlatList
          data={transactions}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          keyExtractor={(item) => item._id}
        />
      </View>
      <View
        style={{ backgroundColor: theme.colors.background, paddingBottom: 20 }}
      >
        <TouchableOpacity
          onPress={() => router.push("/(app)/add_transaction")}
          style={{ alignSelf: "center" }}
        >
          <Icon name="add-circle" size={50} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
    </>
  );
};

// Helper function to calculate total balance
const calculateTotalBalance = (transactions: any[]) => {
  return transactions.reduce((acc, t) => acc + t.remainingBalance, 0);
};

// Helper function to calculate balance color (positive or negative)
const calculateBalanceColor = (transactions: any[]) => {
  const totalBalance = calculateTotalBalance(transactions);
  return totalBalance >= 0 ? "green" : "red";
};

export default CustomerDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  list: {
    paddingBottom: 10,
  },
  balanceText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: "#666",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
  },
  positivePrice: {
    color: "green",
  },
  negativePrice: {
    color: "red",
  },
  label: {
    fontSize: 14,
    color: "#666",
  },
  value: {
    fontSize: 14,
    fontWeight: "bold",
  },
  positiveBalance: {
    color: "green",
  },
  negativeBalance: {
    color: "red",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
  },
});
