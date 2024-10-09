import { useThemeContext } from "@/context/ThemeContext";
import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Button,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Customer from "./Customer";

// Sample Data
const DATA = [
  {
    id: "1",
    name: "John Doe",
    amountPaid: "$200",
    phone: "123-456-7890",
  },
  {
    id: "2",
    name: "Jane Smith",
    amountPaid: "$150",
    phone: "987-654-3210",
  },
  {
    id: "3",
    name: "Jane Smith",
    amountPaid: "$150",
    phone: "987-654-3210",
  },
  {
    id: "4",
    name: "Jane Smith",
    amountPaid: "$150",
    phone: "987-654-3210",
  },
  {
    id: "5",
    name: "Jane Smith",
    amountPaid: "$150",
    phone: "987-654-3210",
  },
  {
    id: "6",
    name: "Jane Smith",
    amountPaid: "$150",
    phone: "987-654-3210",
  },
  {
    id: "7",
    name: "Jane Smith",
    amountPaid: "$150",
    phone: "987-654-3210",
  },
  {
    id: "8",
    name: "Jane Smith",
    amountPaid: "$150",
    phone: "987-654-3210",
  },
  {
    id: "9",
    name: "Jane Smith",
    amountPaid: "$150",
    phone: "987-654-3210",
  },
  {
    id: "10",
    name: "Jane Smith",
    amountPaid: "$150",
    phone: "987-654-3210",
  },

  // Add more items as needed
];

const CustomersList = () => {
  const [expandedItem, setExpandedItem] = useState(null);
  const { theme } = useThemeContext();

  const renderItem = ({ item }: any) => (
    <Customer
      item={item}
      theme={theme}
      expanded={expandedItem === item.id}
      setExpanded={() =>
        setExpandedItem(expandedItem === item.id ? null : item.id)
      }
    />
  );

  return (
    <>
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <FlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      </View>
      <View
        style={{ backgroundColor: theme.colors.background, paddingBottom: 20 }}
      >
        <Icon
          style={{ alignSelf: "center" }}
          name="add-circle"
          size={50}
          color={theme.colors.primary}
        />
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
});

export default CustomersList;
