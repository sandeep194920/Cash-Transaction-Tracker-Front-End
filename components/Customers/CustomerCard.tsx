import { useThemeContext } from "@/context/ThemeContext";
import { Link } from "expo-router";
import { View, Text, StyleSheet, Pressable, Animated } from "react-native";
import MenuOptionsOnCard from "../Menu";
import { commonStyles } from "@/commonStyles";
import { CustomerT } from "@/types";
import { useAppContext } from "@/context/AppContext";
import useCardAnimation from "@/hooks/useCardAnimation";
import CustomIcon from "../CustomIcon";
import { currency } from "@/constants/Generic";
import useMenu from "@/hooks/useMenu";

type CustomerCardT = {
  customer: CustomerT;
  expanded: boolean;
  setExpanded: (value: boolean) => void;
  isNewlyAddedItem: boolean;
};

const CustomerCard = ({
  customer,
  expanded,
  setExpanded,
  isNewlyAddedItem = false,
}: CustomerCardT) => {
  const { name, totalBalance, phone, address, email } = customer;
  const { theme } = useThemeContext();
  const { borderColor, scaleAnim } = useCardAnimation(isNewlyAddedItem);
  const { setCurrentSelectedCustomer } = useAppContext();
  const { isMenuVisible, showMenu, hideMenu } = useMenu();
  return (
    <Link
      style={[
        commonStyles.card,
        { backgroundColor: theme.colors.inputBackground },
      ]}
      asChild
      onPress={() => {
        setCurrentSelectedCustomer(customer);
      }}
      href={{
        pathname: "/(app)/customer_transactions_list",
      }}
    >
      <Pressable>
        <Animated.View
          style={[
            {
              transform: [{ scale: scaleAnim }], // Scale animation (native)
              backgroundColor: theme.colors.inputBackground,
              borderRadius: 10,
            },
          ]}
        >
          <Animated.View
            style={{
              borderColor: borderColor, // Border color animation (JS-driven)
              borderWidth: 2,
              borderRadius: 10,
            }}
          >
            {/* Row with Name, Icon, Amount Paid */}
            <View style={commonStyles.cardRow}>
              <View style={styles.nameSection}>
                <CustomIcon
                  iconName="person"
                  size={24}
                  color={theme.colors.primary}
                />
                <Text style={[styles.name, { color: theme.colors.text }]}>
                  {name}
                </Text>
              </View>
              <MenuOptionsOnCard
                isMenuVisible={isMenuVisible}
                showMenu={showMenu}
                hideMenu={hideMenu}
                editHandler={() => {
                  console.log("Edit from Customer card");
                }}
                deleteHandler={() => {
                  console.log("Delete from Customer card");
                }}
              />
            </View>

            <View style={commonStyles.cardRow}>
              <View style={styles.nameSection}>
                <CustomIcon
                  iconName="account-balance-wallet"
                  size={24}
                  color={theme.colors.primary}
                />

                <Text
                  style={[
                    styles.amountDescription,
                    { color: theme.colors.text },
                  ]}
                >
                  {totalBalance >= 0 ? "Balance Amount" : "Overpaid Amount"}
                </Text>
              </View>
              <View style={commonStyles.rowSection}>
                <CustomIcon
                  iconName={currency}
                  color={theme.colors.primary}
                  size={16}
                />
                <Text
                  style={[
                    styles.amount,
                    {
                      color:
                        totalBalance > 0
                          ? theme.colors.error
                          : theme.colors.success,
                    },
                  ]}
                >
                  {Math.abs(totalBalance).toFixed(2)}
                </Text>
              </View>
            </View>
            {/* Expandable Section with Phone, Edit/Delete buttons */}
            {expanded && (
              <View style={{ marginTop: 5 }}>
                <View style={[styles.expandedRow]}>
                  <CustomIcon
                    iconName="phone"
                    size={20}
                    color={theme.colors.primaryLight}
                  />
                  <Text
                    style={[
                      styles.extraText,
                      { color: theme.colors.secondaryText },
                    ]}
                  >
                    {phone}
                  </Text>
                </View>

                <View style={[styles.expandedRow]}>
                  <CustomIcon
                    iconName="email"
                    size={20}
                    color={theme.colors.primaryLight}
                  />
                  <Text
                    style={[
                      styles.extraText,
                      { color: theme.colors.secondaryText },
                    ]}
                  >
                    {email}
                  </Text>
                </View>

                {address && (
                  <View style={[styles.expandedRow]}>
                    <CustomIcon
                      iconName="house"
                      size={20}
                      color={theme.colors.primaryLight}
                    />
                    <Text
                      style={[
                        styles.extraText,
                        { color: theme.colors.secondaryText },
                      ]}
                    >
                      {address}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Toggle Expand Icon */}
            <CustomIcon
              onPress={() => setExpanded(!expanded)}
              iconName={expanded ? "expand-less" : "expand-more"}
              size={24}
              color={theme.colors.primary}
              additionalStyles={styles.expandIcon}
            />
          </Animated.View>
        </Animated.View>
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
    gap: 2,
  },
  amountDescription: {
    marginLeft: 8,
    fontSize: 14,
  },
  amount: {
    fontSize: 14,
    fontWeight: "bold",
  },
  expandIcon: {
    alignSelf: "flex-start",
  },
  // expandedContent: {
  //   // marginVertical: 16,
  //   // gap: 10,
  // },
  expandedRow: {
    gap: 8,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  extraText: {
    fontSize: 14,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
  },
});

export default CustomerCard;
