import { useThemeContext } from "@/context/ThemeContext";
import { Link } from "expo-router";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import MenuOptionsOnCard from "../Menu";
import { commonStyles } from "@/commonStyles";
import { CustomerT } from "@/types";
import { useAppContext } from "@/context/AppContext";

type CustomerCardT = {
  customer: CustomerT;
  expanded: boolean;
  setExpanded: (value: boolean) => void;
};

const CustomerCard = ({ customer, expanded, setExpanded }: CustomerCardT) => {
  const {
    _id: customerID,
    name,
    totalBalance,
    phone,
    address,
    email,
  } = customer;
  const { theme } = useThemeContext();
  const { setCurrentCustomer } = useAppContext();

  return (
    <Link
      style={[
        commonStyles.card,
        { backgroundColor: theme.colors.inputBackground },
      ]}
      asChild
      onPress={() => {
        setCurrentCustomer(customer);
      }}
      href={{
        pathname: "/(app)/customer_details",
        params: { customerName: name },
      }}
    >
      <Pressable>
        {/* Row with Name, Icon, Amount Paid */}
        <View style={commonStyles.cardRow}>
          <View style={styles.nameSection}>
            <Icon name="person" size={24} color={theme.colors.primary} />
            <Text style={[styles.name, { color: theme.colors.text }]}>
              {name}
            </Text>
          </View>
          <MenuOptionsOnCard />
        </View>

        <View style={commonStyles.cardRow}>
          <View style={styles.nameSection}>
            <Icon
              name="account-balance-wallet"
              size={24}
              color={theme.colors.primary}
            />

            <Text
              style={[styles.amountDescription, { color: theme.colors.text }]}
            >
              Balance
            </Text>
          </View>
          <View style={styles.amountSection}>
            <Icon name="attach-money" size={18} color={theme.colors.primary} />
            <Text style={[styles.amount, { color: theme.colors.text }]}>
              {totalBalance}
            </Text>
          </View>
        </View>

        {/* Expandable Section with Phone, Edit/Delete buttons */}
        {expanded && (
          <View style={[styles.expandedContent]}>
            <View style={[styles.expandedRow]}>
              <Icon name="phone" size={18} color={theme.colors.primaryLight} />
              <Text
                style={[styles.phone, { color: theme.colors.secondaryText }]}
              >
                {phone}
              </Text>
            </View>

            <View style={[styles.expandedRow]}>
              <Icon name="email" size={18} color={theme.colors.primaryLight} />
              <Text
                style={[styles.phone, { color: theme.colors.secondaryText }]}
              >
                {email}
              </Text>
            </View>

            {address && (
              <View style={[styles.expandedRow]}>
                <Icon
                  name="house"
                  size={18}
                  color={theme.colors.primaryLight}
                />
                <Text
                  style={[styles.phone, { color: theme.colors.secondaryText }]}
                >
                  {address}
                </Text>
              </View>
            )}
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
    marginVertical: 16,
    gap: 10,
  },
  expandedRow: {
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  phone: {
    fontSize: 14,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
  },
});

export default CustomerCard;
