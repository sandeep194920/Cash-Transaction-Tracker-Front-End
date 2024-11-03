import { useThemeContext } from "@/context/ThemeContext";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Text,
  ListRenderItemInfo,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import CustomerCard from "./CustomerCard";
import { router } from "expo-router";
import useCustomers from "@/hooks/useCustomers";
import { CustomerT } from "@/types";
import { useAppContext } from "@/context/AppContext";

const CustomersList = () => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const { theme } = useThemeContext();
  const { customers } = useCustomers();
  const { newlyAddedCustomer, setNewlyAddedCustomer } = useAppContext();
  const flatListRef = useRef<FlatList<CustomerT>>(null);

  const renderItem = useCallback(
    ({ ...props }: ListRenderItemInfo<CustomerT>) => {
      const { item: customer } = props;
      const isNewlyAddedItem = newlyAddedCustomer?._id === customer._id;

      return (
        <CustomerCard
          customer={customer}
          expanded={expandedItem === customer._id}
          setExpanded={() =>
            setExpandedItem(expandedItem === customer._id ? null : customer._id)
          }
          isNewlyAddedItem={isNewlyAddedItem}
        />
      );
    },
    [newlyAddedCustomer, expandedItem]
  );
  useEffect(() => {
    // Scroll to end when a new transaction is added
    if (newlyAddedCustomer?._id) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
        setNewlyAddedCustomer(null);
      }, 1000);
    }
  }, [newlyAddedCustomer]);

  return (
    <>
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        {!customers?.length ? (
          <Text style={styles.noCustomersText}>
            Let's add your first lucky customer! Press the + button below
          </Text>
        ) : (
          <FlatList
            ref={flatListRef}
            data={customers}
            renderItem={renderItem}
            keyExtractor={(customer) => customer._id}
            contentContainerStyle={styles.list}
          />
        )}
      </View>
      <View
        style={{ backgroundColor: theme.colors.background, paddingBottom: 20 }}
      >
        <TouchableOpacity
          onPress={() => router.push("/(app)/add_customer")}
          style={{ alignSelf: "center" }}
        >
          <Icon name="add-circle" size={50} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  list: {
    paddingBottom: 10,
  },
  noCustomersText: {
    alignSelf: "center",
    fontWeight: "semibold",
    fontSize: 20,
    padding: "5%",
    lineHeight: 35,
  },
});

export default CustomersList;
