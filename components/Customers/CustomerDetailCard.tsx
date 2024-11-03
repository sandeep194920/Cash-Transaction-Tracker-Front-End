import { commonStyles } from "@/commonStyles";
import { Link } from "expo-router";
import { Animated, View, Text, StyleSheet, Pressable } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import MenuOptionsOnCard from "../Menu";
import { useThemeContext } from "@/context/ThemeContext";
import { TransactionT } from "@/types";
import { formattedDateStr } from "@/utils/dateTime";
import { useEffect, useRef } from "react";
import useCardAnimation from "@/hooks/useCardAnimation";

type CustomerDetailCardT = {
  item: TransactionT;
  expanded: boolean;
  setExpanded: (value: boolean) => void;
  isNewlyAddedItem: boolean;
};

const CustomerDetailCard = ({
  item,
  expanded,
  setExpanded,
  isNewlyAddedItem = false,
}: CustomerDetailCardT) => {
  const { theme } = useThemeContext();
  const { borderColor, scaleAnim } = useCardAnimation(isNewlyAddedItem);
  const { dateLong, dateShort } = formattedDateStr(item.transactionDate);

  return (
    <Link
      onPress={() => {
        console.log("Clicked on customer of id", item._id);
      }}
      style={[
        commonStyles.card,
        { backgroundColor: theme.colors.inputBackground },
      ]}
      asChild
      href={{
        pathname: "/(app)/transaction_detail",
        params: { transactionDate: dateShort },
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
            <View style={[commonStyles.cardRow, { marginBottom: 10 }]}>
              <View style={commonStyles.rowSection}>
                <Text style={[styles.header, { color: theme.colors.text }]}>
                  {dateLong}
                </Text>
              </View>
              <MenuOptionsOnCard />
            </View>

            <View style={commonStyles.cardRow}>
              <View style={commonStyles.rowSection}>
                <Text
                  style={[
                    styles.amountDescription,
                    { color: theme.colors.text },
                  ]}
                >
                  Order price
                </Text>
              </View>
              <View style={commonStyles.rowSection}>
                <Icon
                  name="attach-money"
                  size={18}
                  color={theme.colors.error}
                />
                <Text style={[styles.amount, { color: theme.colors.text }]}>
                  {item.grossPrice}
                </Text>
              </View>
            </View>

            <View style={commonStyles.cardRow}>
              <View style={commonStyles.rowSection}>
                <Text
                  style={[
                    styles.amountDescription,
                    { color: theme.colors.text },
                  ]}
                >
                  Amount paid
                </Text>
              </View>
              <View style={commonStyles.rowSection}>
                <Icon
                  name="attach-money"
                  size={18}
                  color={theme.colors.error}
                />
                <Text style={[styles.amount, { color: theme.colors.text }]}>
                  {item.amountPaid}
                </Text>
              </View>
            </View>

            <View style={commonStyles.cardRow}>
              <View style={commonStyles.rowSection}>
                <Text
                  style={[
                    styles.amountDescription,
                    { color: theme.colors.text },
                  ]}
                >
                  Remaining balance
                </Text>
              </View>
              <View style={commonStyles.rowSection}>
                <Icon
                  name="attach-money"
                  size={18}
                  color={theme.colors.error}
                />
                <Text style={[styles.amount, { color: theme.colors.text }]}>
                  {item.balanceAmount}
                </Text>
              </View>
            </View>

            {/* Expandable Section with Phone, Edit/Delete buttons */}
            {expanded && (
              <View style={commonStyles.cardRow}>
                <View style={commonStyles.rowSection}>
                  <Text
                    style={[
                      styles.amountDescription,
                      { color: theme.colors.text },
                    ]}
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
          </Animated.View>
        </Animated.View>
      </Pressable>
    </Link>
  );
};

const styles = StyleSheet.create({
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

export default CustomerDetailCard;
