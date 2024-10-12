import { commonStyles } from "@/commonStyles";
import { Link } from "expo-router";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import MenuOptionsOnCard from "../Menu";

const Customer = ({ item, theme, expanded, setExpanded }: any) => {
  return (
    <Link
      style={[
        commonStyles.card,
        { backgroundColor: theme.colors.inputBackground },
      ]}
      asChild
      href={{
        pathname: "/(app)/customer_details",
        params: { customerName: item.name },
      }}
    >
      <Pressable>
        {/* Row with Name, Icon, Amount Paid */}
        <View style={[commonStyles.cardRow, { marginBottom: 10 }]}>
          <View style={commonStyles.rowSection}>
            <Text style={[styles.header, { color: theme.colors.text }]}>
              {item.date}
            </Text>
          </View>
          <MenuOptionsOnCard />
        </View>

        <View style={commonStyles.cardRow}>
          <View style={commonStyles.rowSection}>
            <Text
              style={[styles.amountDescription, { color: theme.colors.text }]}
            >
              Order price
            </Text>
          </View>
          <View style={commonStyles.rowSection}>
            <Icon name="attach-money" size={18} color={theme.colors.error} />
            <Text style={[styles.amount, { color: theme.colors.text }]}>
              {item.price}
            </Text>
          </View>
        </View>

        <View style={commonStyles.cardRow}>
          <View style={commonStyles.rowSection}>
            <Text
              style={[styles.amountDescription, { color: theme.colors.text }]}
            >
              Amount paid
            </Text>
          </View>
          <View style={commonStyles.rowSection}>
            <Icon name="attach-money" size={18} color={theme.colors.error} />
            <Text style={[styles.amount, { color: theme.colors.text }]}>
              {item.amountPaid}
            </Text>
          </View>
        </View>

        <View style={commonStyles.cardRow}>
          <View style={commonStyles.rowSection}>
            <Text
              style={[styles.amountDescription, { color: theme.colors.text }]}
            >
              Remaining balance
            </Text>
          </View>
          <View style={commonStyles.rowSection}>
            <Icon name="attach-money" size={18} color={theme.colors.error} />
            <Text style={[styles.amount, { color: theme.colors.text }]}>
              {item.remainingBalance}
            </Text>
          </View>
        </View>

        {/* Expandable Section with Phone, Edit/Delete buttons */}
        {expanded && (
          <View style={commonStyles.cardRow}>
            <View style={commonStyles.rowSection}>
              <Text
                style={[styles.amountDescription, { color: theme.colors.text }]}
              >
                Number of items
              </Text>
            </View>
            <View style={commonStyles.rowSection}>
              <Text style={[styles.amount, { color: theme.colors.text }]}>
                2
              </Text>
            </View>
          </View>
        )}

        {/* Toggle Expand Icon */}
        <Icon
          onPress={() => setExpanded(!expanded)}
          name={expanded ? "expand-less" : "expand-more"}
          size={24}
          color={theme.colors.primary}
          style={styles.expandIcon}
        />
      </Pressable>
    </Link>
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
  header: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
  amountDescription: {
    marginLeft: 8,
    fontSize: 14,
  },
  amount: {
    fontSize: 14,
  },
  expandIcon: {
    alignSelf: "flex-start",
  },
  expandedContent: {
    marginTop: 16,
    marginLeft: 8,
    marginBottom: 8,
  },
  items: {
    fontSize: 14,
    marginBottom: 8,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
  },
});

export default Customer;
