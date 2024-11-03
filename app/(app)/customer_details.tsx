import {
  Text,
  StyleSheet,
  View,
  FlatList,
  ListRenderItemInfo,
  TouchableOpacity,
} from "react-native";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Stack, router } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useThemeContext } from "@/context/ThemeContext";
import CustomerDetailCard from "@/components/Customers/CustomerDetailCard";
import { TransactionT } from "@/types";
import useTransactions from "@/hooks/useTransactions";
import Loading from "@/components/Loading";
import { commonStyles } from "@/commonStyles";
import { useAppContext } from "@/context/AppContext";

const CustomerDetails = () => {
  const { theme } = useThemeContext();

  const {
    currentCustomer,
    isLoading,
    newlyAddedTransaction,
    setNewlyAddedTransaction,
  } = useAppContext();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const { customerTransactions, isLoadingTransactions } = useTransactions();

  const flatListRef = useRef<FlatList<TransactionT>>(null);

  const renderItem = useCallback(
    ({ ...props }: ListRenderItemInfo<TransactionT>) => {
      const { item } = props;
      // Check if the current item is the newly added transaction
      const isNewlyAddedItem = newlyAddedTransaction?._id === item._id;

      return (
        <CustomerDetailCard
          isNewlyAddedItem={isNewlyAddedItem}
          item={item}
          expanded={expandedItem === item._id}
          setExpanded={() =>
            setExpandedItem(expandedItem === item._id ? null : item._id)
          }
        />
      );
    },
    [newlyAddedTransaction, expandedItem]
  );

  useEffect(() => {
    // Scroll to end when a new transaction is added
    if (newlyAddedTransaction?._id) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
        setNewlyAddedTransaction(null);
      }, 1000);
    }
  }, [newlyAddedTransaction]);

  if (isLoadingTransactions || isLoading) return <Loading />;

  if (!currentCustomer) return null;

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: currentCustomer.name ? currentCustomer.name : "Details",
        }}
      />

      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        {!customerTransactions?.length ? (
          <View>
            <View style={[commonStyles.rowSection, { marginVertical: 16 }]}>
              <Text
                style={[styles.balanceText, { color: theme.colors.primary }]}
              >
                No transactions yet
              </Text>
            </View>
            <Text
              style={[
                { paddingHorizontal: 20, lineHeight: 20 },
                { color: theme.colors.text },
              ]}
            >
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
            ref={flatListRef}
            data={customerTransactions}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            keyExtractor={(item) => item._id}
            // for scrolling, we need this getItemLayout prop to be present on this Flatlist.
            // getItemLayout={(data, index) => ({
            //   length: 100, // Replace with the height of each item
            //   offset: 100 * index,
            //   index,
            // })}
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
