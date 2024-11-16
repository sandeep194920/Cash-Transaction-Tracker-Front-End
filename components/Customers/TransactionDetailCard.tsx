import { commonStyles } from "@/commonStyles";
import { Link } from "expo-router";
import { Animated, View, Text, StyleSheet, Pressable } from "react-native";
import MenuOptionsOnCard from "../Menu";
import { useThemeContext } from "@/context/ThemeContext";
import { TransactionT } from "@/types";
import { formattedDateStr } from "@/utils/dateTime";
import useCardAnimation from "@/hooks/useCardAnimation";
import { useAppContext } from "@/context/AppContext";
import { balanceTypeDescriptions, currency } from "@/constants/Generic";
import CustomIcon from "../CustomIcon";
import useMenu from "@/hooks/useMenu";
import AnimatedView from "../AnimatedView";

type TransactionDetailCardT = {
  transaction: TransactionT;
  expanded: boolean;
  setExpanded: (value: boolean) => void;
  isNewlyAddedItem: boolean;
};

const TransactionDetailCard = ({
  transaction,
  expanded,
  setExpanded,
  isNewlyAddedItem = false,
}: TransactionDetailCardT) => {
  const {
    totalPrice,
    amountPaid,
    balanceAmount,
    transactionDate,
    items,
    transactionType,
  } = transaction;
  const { isMenuVisible, showMenu, hideMenu } = useMenu();
  const { theme } = useThemeContext();
  const { borderColor, scaleAnim } = useCardAnimation(isNewlyAddedItem);
  const { dateLong } = formattedDateStr(transactionDate);
  const { setCurrentSelectedTransaction } = useAppContext();

  const dateUI = (
    <View style={commonStyles.rowSection}>
      <Text style={[styles.header, { color: theme.colors.text }]}>
        {dateLong}
      </Text>
    </View>
  );

  const balanceAdjustTransaction = (
    <Pressable
      style={[
        commonStyles.card,
        {
          backgroundColor: theme.colors.inputBackground,
        },
      ]}
    >
      <AnimatedView borderColor={borderColor} scaleAnim={scaleAnim}>
        <View style={[commonStyles.cardRow, { marginBottom: 10 }]}>
          {dateUI}
          <Text
            style={[
              styles.amountDescription,
              { color: theme.colors.primary, fontWeight: "800" },
            ]}
          >
            Balance Adjusted
          </Text>
        </View>
        {/* Balance Adjusted */}
        <View style={commonStyles.cardRow}>
          <View style={commonStyles.rowSection}></View>
          <View
            style={{
              borderColor: theme.colors.primary,
            }}
          ></View>
        </View>

        {/* Remaining Balance */}
        <View style={commonStyles.cardRow}>
          <View style={commonStyles.rowSection}>
            <Text
              style={[
                styles.amountDescription,
                {
                  color:
                    balanceAmount >= 0
                      ? theme.colors.error
                      : theme.colors.success,
                },
              ]}
            >
              {balanceAmount >= 0 ? "Remaining balance" : "Overpaid amount"}
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
                    balanceAmount >= 0
                      ? theme.colors.error
                      : theme.colors.success,
                },
              ]}
            >
              {Math.abs(balanceAmount).toFixed(2)}
            </Text>
          </View>
        </View>
      </AnimatedView>
    </Pressable>
  );

  if (transactionType === "balanceUpdate") {
    return balanceAdjustTransaction;
  }

  return (
    <Link
      style={[
        commonStyles.card,
        { backgroundColor: theme.colors.inputBackground },
      ]}
      asChild
      onPress={() => {
        setCurrentSelectedTransaction(transaction);
      }}
      href={{
        pathname: "/(app)/transaction_detail",
      }}
    >
      <Pressable>
        <AnimatedView borderColor={borderColor} scaleAnim={scaleAnim}>
          <View style={[commonStyles.cardRow, { marginBottom: 10 }]}>
            {dateUI}

            {/* Let's not edit or delete a transaction for now. We can do that in the future if necessary */}

            {/* <MenuOptionsOnCard
              isMenuVisible={isMenuVisible}
              showMenu={showMenu}
              hideMenu={hideMenu}
              editHandler={() => {
                console.log("Edit from Transaction detail card");
              }}
              deleteHandler={() => {
                console.log("Delete from Transaction detail card");
              }}
            /> */}
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
              <CustomIcon
                iconName={currency}
                color={theme.colors.primary}
                size={16}
              />
              <Text style={[styles.amount, { color: theme.colors.text }]}>
                {totalPrice}
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
              <CustomIcon
                iconName={currency}
                color={theme.colors.primary}
                size={16}
              />
              <Text style={[styles.amount, { color: theme.colors.text }]}>
                {amountPaid.toFixed(2)}
              </Text>
            </View>
          </View>

          <View style={commonStyles.cardRow}>
            <View style={commonStyles.rowSection}>
              <Text
                style={[
                  styles.amountDescription,
                  {
                    color:
                      balanceAmount >= 0
                        ? theme.colors.error
                        : theme.colors.success,
                  },
                ]}
              >
                {balanceAmount >= 0 ? "Remaining balance" : "Overpaid amount"}
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
                      balanceAmount >= 0
                        ? theme.colors.error
                        : theme.colors.success,
                  },
                ]}
              >
                {Math.abs(balanceAmount).toFixed(2)}
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
                  {items.length}
                </Text>
              </View>
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
        </AnimatedView>
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

export default TransactionDetailCard;
