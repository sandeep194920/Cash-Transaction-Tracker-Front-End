import { useThemeContext } from "@/context/ThemeContext";
import React, { useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Text,
  ListRenderItemInfo,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Customer from "./Customer";
import { useRouter } from "expo-router";
import Loading from "../Loading";
import useCustomers from "@/hooks/useCustomers";
import { CustomerT } from "@/types";

const CustomersList = () => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const { theme } = useThemeContext();
  const { customers, isLoadingCustomers } = useCustomers();
  const router = useRouter();

  if (isLoadingCustomers) return <Loading />;

  const renderItem = ({ ...props }: ListRenderItemInfo<CustomerT>) => {
    const { item } = props;
    return (
      <Customer
        item={item}
        theme={theme}
        expanded={expandedItem === item._id}
        setExpanded={() =>
          setExpandedItem(expandedItem === item._id ? null : item._id)
        }
      />
    );
  };

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
            data={customers}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
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
