import { themes } from "@/constants/Colors";
import { useThemeContext } from "@/context/ThemeContext";
import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const ListItem = ({ item, theme, expanded, setExpanded }: any) => {
  return (
    <View
      style={[styles.card, { backgroundColor: theme.colors.inputBackground }]}
    >
      {/* Row with Name, Icon, Amount Paid */}
      <View style={styles.row}>
        <View style={styles.nameSection}>
          <Icon name="person" size={24} color={theme.colors.primary} />
          <Text style={[styles.name, { color: theme.colors.text }]}>
            {item.name}
          </Text>
        </View>
        <View style={styles.amountSection}>
          <Icon name="attach-money" size={24} color={theme.colors.primary} />
          <Text style={[styles.amount, { color: theme.colors.text }]}>
            {item.amountPaid}
          </Text>
        </View>
      </View>

      {/* Expandable Section with Phone, Edit/Delete buttons */}
      {expanded && (
        <View style={styles.expandedContent}>
          <Text style={[styles.phone, { color: theme.colors.secondaryText }]}>
            Phone: {item.phone}
          </Text>
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => Alert.alert("Edit")}>
              <Icon name="edit" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Alert.alert("Delete")}>
              <Icon name="delete" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Toggle Expand Icon */}
      <TouchableOpacity onPress={() => setExpanded(!expanded)}>
        <Icon
          name={expanded ? "expand-less" : "expand-more"}
          size={24}
          color={theme.colors.primary}
        />
      </TouchableOpacity>
    </View>
  );
};

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
  // Add more items as needed
];

const ListItems = () => {
  const [expandedItem, setExpandedItem] = useState(null);
  const { theme } = useThemeContext();

  const renderItem = ({ item }: any) => (
    <ListItem
      item={item}
      theme={theme}
      expanded={expandedItem === item.id}
      setExpanded={() =>
        setExpandedItem(expandedItem === item.id ? null : item.id)
      }
    />
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Toggle between light and dark themes */}
      {/* <Switch
        value={isDarkTheme}
        onValueChange={() => setIsDarkTheme(!isDarkTheme)}
        trackColor={{
          false: lightTheme.colors.primary,
          true: darkTheme.colors.primary,
        }}
      /> */}

      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  list: {
    paddingBottom: 16,
  },
  card: {
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
  },
  nameSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
  amountSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  amount: {
    marginLeft: 4,
    fontSize: 16,
  },
  expandedContent: {
    marginTop: 16,
  },
  phone: {
    fontSize: 14,
    marginBottom: 8,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
  },
});

export default ListItems;
