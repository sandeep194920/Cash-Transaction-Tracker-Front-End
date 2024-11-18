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
import CustomerCard from "./CustomerCard";
import { router, Stack } from "expo-router";
import useCustomers from "@/hooks/useCustomers";
import { CustomerT } from "@/types";
import { useAppContext } from "@/context/AppContext";
import CustomIcon from "../CustomIcon";
import { commonStyles } from "@/commonStyles";
import { useAuthContext } from "@/context/AuthContext";
import useUser from "@/hooks/useUser";

const CustomersList = () => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const { theme } = useThemeContext();
  const { customers } = useCustomers();
  const { loggedInUser: userData } = useAuthContext();
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
          <View>
            <Stack.Screen
              options={{ headerTitle: `Welcome to CTT, ${userData?.name}` }}
            />
            <View style={[commonStyles.rowSection, { marginVertical: 16 }]}>
              <Text
                style={[styles.userTotalText, { color: theme.colors.primary }]}
              >
                Let's add your first customer!
              </Text>
            </View>
            <View
              style={[
                commonStyles.rowSection,
                { flexWrap: "wrap", padding: 10 },
              ]}
            >
              <Text style={[{ color: theme.colors.text }]}>
                Let's add your first lucky customer! Press the
              </Text>
              <CustomIcon
                iconName="add-circle"
                size={24}
                color={theme.colors.primary}
                marginLeft={2}
                marginRight={2}
              />
              <Text style={[{ color: theme.colors.text }]}>button below.</Text>
            </View>
          </View>
        ) : (
          <View style={{ marginVertical: 16, gap: 6 }}>
            <View style={[commonStyles.rowSection]}>
              <Text
                style={[
                  styles.userTotalText,
                  {
                    color:
                      userData && userData?.userTotal > 0
                        ? theme.colors.error
                        : theme.colors.success,
                  },
                ]}
              >
                Total Amount -
              </Text>

              <CustomIcon
                iconName="dollar"
                size={18}
                color={
                  userData && userData?.userTotal > 0
                    ? theme.colors.error
                    : theme.colors.success
                }
                marginRight={2}
                marginLeft={2}
              />
              <Text
                style={[
                  styles.userTotalText,
                  {
                    color:
                      userData && userData?.userTotal > 0
                        ? theme.colors.error
                        : theme.colors.success,
                  },
                ]}
              >
                {userData?.userTotal ? userData.userTotal.toFixed(2) : 0}
              </Text>
            </View>
          </View>
        )}

        {customers?.length ? (
          <FlatList
            ref={flatListRef}
            data={customers}
            renderItem={renderItem}
            keyExtractor={(customer) => customer._id}
            contentContainerStyle={styles.list}
          />
        ) : null}
      </View>

      <View
        style={{ backgroundColor: theme.colors.background, paddingBottom: 20 }}
      >
        <TouchableOpacity
          onPress={() => router.push("/(app)/add_customer")}
          style={{ alignSelf: "center" }}
        >
          <CustomIcon
            iconName="add-circle"
            size={50}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
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
  userTotalText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default CustomersList;
