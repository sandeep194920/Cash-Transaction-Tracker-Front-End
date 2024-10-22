import {
  Text,
  StyleSheet,
  View,
  FlatList,
  ListRenderItemInfo,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { Stack, useLocalSearchParams, router } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useThemeContext } from "@/context/ThemeContext";
import CustomerDetailCard from "@/components/Customers/CustomerDetailCard";
import { TransactionT } from "@/types";
import useTransactions from "@/hooks/useTransactions";
import Loading from "@/components/Loading";
import { commonStyles } from "@/commonStyles";
import { useAppContext } from "@/context/AppContext";
import { useQueryClient } from "@tanstack/react-query";

const CustomerDetails = () => {
  const { theme } = useThemeContext();
  const { customerName } = useLocalSearchParams();
  const queryClient = useQueryClient();

  const {
    currentCustomer,
    isLoading,
    newlyAddedTransaction,
    setNewlyAddedTransaction,
  } = useAppContext();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const { customerTransactions, isLoadingTransactions } = useTransactions();

  // Reference to FlatList
  const flatListRef = useRef<FlatList>(null);

  const renderItem = ({ ...props }: ListRenderItemInfo<TransactionT>) => {
    const { item } = props;
    // Check if the current item is the newly added transaction
    const isNewlyAddedItem = newlyAddedTransaction?._id === item._id;
    console.log("Is newly added item", isNewlyAddedItem, " item", item);
    return (
      <CustomerDetailCard
        isNewItem={isNewlyAddedItem}
        item={item}
        expanded={expandedItem === item._id}
        setExpanded={() =>
          setExpandedItem(expandedItem === item._id ? null : item._id)
        }
      />
    );
  };

  const isFetchingTransactions = queryClient.isFetching({
    queryKey: ["customer_transactions", currentCustomer?._id],
  });

  useEffect(() => {
    if (
      !isFetchingTransactions &&
      newlyAddedTransaction?._id &&
      customerTransactions?.length
    ) {
      // Find index of newly added transaction
      console.log("The customer transactions are", customerTransactions);
      console.log("Now added transaction is", newlyAddedTransaction);
      const index = customerTransactions.findIndex(
        (transaction) => transaction._id === newlyAddedTransaction._id
      );
      console.log("The index is", index);
      // Scroll to the index of the newly added transaction
      if (index !== -1 && flatListRef.current) {
        console.log("REACHED HERE");
        flatListRef.current.scrollToIndex({
          index,
          animated: true,
        });
      }

      // Reset the newlyAddedTransaction after scrolling
      setNewlyAddedTransaction(null);
    }
  }, [newlyAddedTransaction, customerTransactions, isFetchingTransactions]);

  if (isLoadingTransactions || isLoading) return <Loading />;

  if (!currentCustomer) return null;

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
        {!customerTransactions?.length ? (
          <View>
            <View style={[commonStyles.rowSection, { marginVertical: 16 }]}>
              <Text style={[styles.balanceText]}>No transactions yet</Text>
            </View>
            <Text style={{ paddingHorizontal: 20, lineHeight: 20 }}>
              You can add your first transaction by pressing the plus icon below
            </Text>
          </View>
        ) : (
          <View style={[commonStyles.rowSection, { marginVertical: 16 }]}>
            <Text style={[styles.balanceText, { color: theme.colors.error }]}>
              Balance Amount -
            </Text>
            <Icon
              style={{ fontWeight: "bold" }}
              name="attach-money"
              size={20}
              color={theme.colors.primary}
            />
            <Text style={[styles.balanceText, { color: theme.colors.error }]}>
              {currentCustomer.totalBalance}
            </Text>
          </View>
        )}

        {customerTransactions?.length ? (
          <FlatList
            ref={flatListRef} // Attach ref to FlatList
            data={customerTransactions}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            keyExtractor={(item) => item._id}
            // for scrolling, we need this getItemLayout prop to be present on this Flatlist.
            getItemLayout={(data, index) => ({
              length: 500, // Replace with the height of each item
              offset: 500 * index + 1,
              index,
            })}
          />
        ) : null}
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
    fontSize: 20,
    fontWeight: "bold",
  },
});
