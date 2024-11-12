import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import HeaderLeftBackArrow from "@/components/HeaderLeftBackArrow";
import { useThemeContext } from "@/context/ThemeContext";
import { commonStyles } from "@/commonStyles";
import CustomIcon from "@/components/CustomIcon";
import { currency } from "@/constants/Generic";
import { useAppContext } from "@/context/AppContext";
import { router, Stack } from "expo-router";
import { useFormik } from "formik";
import * as yup from "yup";
import Button from "@/components/Button";
import useTransactions from "@/hooks/useTransactions";
import { BalanceTypeT } from "@/types";
import Loading from "@/components/Loading";

type ButtonTextRecordT = "text" | "description";

type ButtonTextT = Record<BalanceTypeT, Record<ButtonTextRecordT, string>>;

const buttonText: ButtonTextT = {
  "settle-up": {
    text: "Make the Balance 0",
    description:
      "This will turn the customer's balance to 0. This operation can't be reversed.",
  },
  "balance-remaining": {
    text: "Confirm New Balance",
    description:
      "The amount you enter must be atleast 1 or above and must be lesser than the balance amount. This operation can't be reversed.",
  },
  overpaying: {
    text: "Confirm Overpayment",
    description:
      "The amount you enter must be greater than the balance amount. This operation can't be reversed.",
  },
} as const;

const BalanceAdjust = () => {
  const { theme } = useThemeContext();
  const { currentSelectedCustomer } = useAppContext();
  const {
    adjustCustomerBalance,
    isBalanceAdjustLoading,
    isBalanceAdjustNotCompleted,
  } = useTransactions();
  const [balanceType, setBalanceType] = useState<BalanceTypeT>("settle-up");

  let validationSchema = useMemo(() => {
    if (balanceType === "overpaying" && currentSelectedCustomer?.totalBalance) {
      return yup.object().shape({
        amountPaid: yup
          .number()
          .required("Amount paid is required")
          .min(
            currentSelectedCustomer.totalBalance + 0.0001,
            "Amount paid must be greater than current balance!"
          ),
        // .positive("Amount must be positive"), // INFO: This would expect min to be 1, so commenting this out and adding .min here
      });
    } else if (
      balanceType === "balance-remaining" &&
      currentSelectedCustomer?.totalBalance
    ) {
      return yup.object().shape({
        amountPaid: yup
          .number()
          .required("Amount paid is required")
          .max(
            currentSelectedCustomer.totalBalance - 0.0001,
            "Amount paid must be less than the current balance!"
          )
          .positive("Amount must be positive"), // INFO: This would expect min to be 1, so commenting this out and adding .min here
      });
    }
  }, [balanceType, currentSelectedCustomer]);

  // Formik for form handling
  const formik = useFormik({
    initialValues: {
      amountPaid: "",
    },
    validationSchema,
    onSubmit: (values) => {
      if (adjustCustomerBalance) {
        if (balanceType === "settle-up") {
          adjustCustomerBalance({
            balanceType,
            newBalanceAmount: 0,
          });
        } else {
          adjustCustomerBalance({
            balanceType,
            newBalanceAmount: +values.amountPaid,
          });
        }
      }
    },
  });

  useEffect(() => {
    /*
  
    Initally, isTransactionAdding -> false and isTransactionAddingNotCompleted -> true (so !false and !true) will yield false so the router.dismiss will not run.

    When transaction is adding, isTransactionAdding -> true, and isTransactionAddingNotCompleted -> false (so !true and !false ) is false, so it will not run.

    When transaction is added, isTransactionAdding -> false and isTransactionAddingNotCompleted -> false (so it will give true)

    */
    if (!isBalanceAdjustLoading && !isBalanceAdjustNotCompleted) {
      router.dismiss();
    }
  }, [isBalanceAdjustLoading, isBalanceAdjustNotCompleted]);

  if (isBalanceAdjustLoading) {
    return <Loading />;
  }

  // Add this line after useEffect to avoid error
  if (!currentSelectedCustomer) return null;
  const { name, totalBalance } = currentSelectedCustomer;

  const themeStyles = {
    backgroundColor: theme.colors.background,
    textColor: theme.colors.text,
    radioBorderColor: theme.colors.text,
    radioFillColor: theme.colors.primary,
  };

  return (
    <>
      <HeaderLeftBackArrow />
      <Stack.Screen
        options={{ headerTitle: `Adjust ${name}'s Balance Amount` }}
      />
      <View
        style={[
          styles.modalContainer,
          commonStyles.flex1,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <Text style={[styles.label, { color: theme.colors.text }]}>
          {totalBalance > 0
            ? "Remaining Balance Amount:"
            : "Total Overpaid Amount:"}
        </Text>
        <View
          style={[commonStyles.rowSection, { justifyContent: "flex-start" }]}
        >
          <CustomIcon
            iconName={currency}
            size={16}
            color={theme.colors.primary}
          />
          <Text style={[styles.value, { color: theme.colors.text }]}>
            {totalBalance.toFixed(2)}
          </Text>
        </View>
        <View
          style={[
            commonStyles.rowSection,
            styles.textContainer,
            { flexWrap: "wrap" },
          ]}
        >
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Enter New Balance:
          </Text>
          {/* <Text style={[styles.subText, { color: theme.colors.secondaryText }]}>
            This will override current balance amount, and can't be reversed!
          </Text> */}
        </View>

        <View style={styles.option}>
          <TouchableOpacity
            style={commonStyles.cardRow}
            onPress={() => {
              setBalanceType("settle-up");
            }}
          >
            <View
              style={[commonStyles.rowSection, { gap: 2, flexWrap: "wrap" }]}
            >
              <Text
                style={[
                  styles.optionText,
                  {
                    color:
                      balanceType === "settle-up"
                        ? theme.colors.text
                        : theme.colors.secondaryText,
                  },
                ]}
              >
                Settle Up!
              </Text>
              <View style={commonStyles.rowSection}>
                <Text
                  style={[
                    styles.subText,
                    {
                      color:
                        balanceType === "settle-up"
                          ? theme.colors.text
                          : theme.colors.secondaryText,
                    },
                  ]}
                >
                  (Make the balace as{" "}
                </Text>
                <CustomIcon
                  iconName={currency}
                  size={12}
                  color={theme.colors.primary}
                />

                <Text
                  style={[
                    styles.subText,
                    {
                      color:
                        balanceType === "settle-up"
                          ? theme.colors.text
                          : theme.colors.secondaryText,
                    },
                  ]}
                >
                  0)
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.radioCircle,
                { borderColor: themeStyles.radioFillColor },
                balanceType === "settle-up" && {
                  backgroundColor: themeStyles.radioFillColor,
                },
              ]}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.option}>
          <TouchableOpacity
            style={commonStyles.cardRow}
            onPress={() => {
              setBalanceType("balance-remaining");
            }}
          >
            <View style={[commonStyles.rowSection, { gap: 2 }]}>
              <Text
                style={[
                  styles.optionText,
                  {
                    color:
                      balanceType === "balance-remaining"
                        ? theme.colors.text
                        : theme.colors.secondaryText,
                  },
                ]}
              >
                Paying partial balance amount
              </Text>
            </View>

            <View
              style={[
                styles.radioCircle,
                { borderColor: themeStyles.radioFillColor },
                balanceType === "balance-remaining" && {
                  backgroundColor: themeStyles.radioFillColor,
                },
              ]}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.option}>
          <TouchableOpacity
            style={commonStyles.cardRow}
            onPress={() => {
              setBalanceType("overpaying");
            }}
          >
            <View
              style={[commonStyles.rowSection, { gap: 2, flexWrap: "wrap" }]}
            >
              <Text
                style={[
                  styles.optionText,
                  {
                    color:
                      balanceType === "overpaying"
                        ? theme.colors.text
                        : theme.colors.secondaryText,
                  },
                ]}
              >
                Overpaying
              </Text>
              <Text
                style={[
                  styles.subText,
                  {
                    color:
                      balanceType === "overpaying"
                        ? theme.colors.text
                        : theme.colors.secondaryText,
                  },
                ]}
              >
                (Paying more than the balance)
              </Text>
            </View>
            <View
              style={[
                styles.radioCircle,
                { borderColor: themeStyles.radioFillColor },
                balanceType === "overpaying" && {
                  backgroundColor: themeStyles.radioFillColor,
                },
              ]}
            />
          </TouchableOpacity>
        </View>

        {balanceType !== "settle-up" && (
          <View>
            {/* Input field for amount paid */}
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: theme.colors.secondaryText,
                  color: theme.colors.text,
                },
              ]}
              placeholder="Enter Amount Paid"
              placeholderTextColor={theme.colors.secondaryText}
              value={formik.values.amountPaid}
              onChangeText={formik.handleChange("amountPaid")}
              onBlur={formik.handleBlur("amountPaid")}
              keyboardType="numeric"
            />
            {formik.touched.amountPaid && formik.errors.amountPaid ? (
              <Text style={styles.errorText}>{formik.errors.amountPaid}</Text>
            ) : null}
          </View>
        )}

        {/* Note text */}
        <Text
          style={[
            styles.subText,
            { color: theme.colors.error, lineHeight: 16 },
          ]}
        >
          {buttonText[balanceType].description}
        </Text>

        {/* Submit Button */}
        <Button
          title={buttonText[balanceType].text}
          pressHandler={formik.handleSubmit}
          color={theme.colors.primary}
          textColor={theme.colors.buttonText}
        />
      </View>
    </>
  );
};

export default BalanceAdjust;

const styles = StyleSheet.create({
  modalContainer: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5,
    gap: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 8,
  },
  value: {
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
  },
  subText: {
    fontSize: 10,
  },
  textContainer: {
    justifyContent: "flex-start",
    gap: 4,
    alignItems: "center",
  },

  option: {
    marginVertical: 0,
  },
  radioCircle: {
    height: 16,
    width: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  optionText: {
    fontSize: 12,
  },
});
