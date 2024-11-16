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

const balanceTypeText: Record<BalanceTypeT, string> = {
  "settle-up": "Settle-up will set the customer balance to 0",
  positive: "Positive balance indicates customer is overpaying",
  negative:
    "Negative balance indicates customer has a remaining balance amount",
};

const BalanceAdjust = () => {
  const { theme } = useThemeContext();
  const { currentSelectedCustomer } = useAppContext();
  const {
    adjustCustomerBalance,
    isBalanceAdjustLoading,
    isBalanceAdjustNotCompleted,
  } = useTransactions();

  const [balanceType, setBalanceType] = useState<BalanceTypeT>("settle-up");
  const [balancePrediction, setBalancePrediction] = useState<number | null>(
    null
  );

  const validationSchema = useMemo(() => {
    if (balanceType === "settle-up") {
      return null;
    }
    return yup.object().shape({
      amountPaid: yup
        .number()
        .typeError("Enter a valid number")
        .required("Amount paid is required")
        .positive("Don't include - sign. Just enter the amount!"),
    });
  }, [balanceType]);

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
          <Text
            style={[
              styles.value,
              {
                color:
                  totalBalance < 0 ? theme.colors.success : theme.colors.error,
                fontWeight: "600",
              },
            ]}
          >
            {Math.abs(totalBalance).toFixed(2)}
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
                  {
                    color: theme.colors.text,
                  },
                ]}
              >
                Settle Up (Make balance 0)
              </Text>
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
              setBalanceType("negative");
            }}
          >
            <View
              style={[commonStyles.rowSection, { gap: 2, flexWrap: "wrap" }]}
            >
              <Text
                style={[
                  {
                    color: theme.colors.text,
                  },
                ]}
              >
                Set negative balance (No need of - sign)
              </Text>
            </View>
            <View
              style={[
                styles.radioCircle,
                { borderColor: themeStyles.radioFillColor },
                balanceType === "negative" && {
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
              setBalanceType("positive");
            }}
          >
            <View style={[commonStyles.rowSection, { gap: 2 }]}>
              <Text
                style={[
                  {
                    color: theme.colors.text,
                  },
                ]}
              >
                Set positive balance
              </Text>
            </View>

            <View
              style={[
                styles.radioCircle,
                { borderColor: themeStyles.radioFillColor },
                balanceType === "positive" && {
                  backgroundColor: themeStyles.radioFillColor,
                },
              ]}
            />
          </TouchableOpacity>
        </View>

        <Text style={[{ color: theme.colors.primary, fontWeight: "bold" }]}>
          {balanceTypeText[balanceType]}
        </Text>

        <View>
          {balanceType !== "settle-up" && (
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
              // onChangeText={formik.handleChange("amountPaid")}
              onChangeText={(text) => {
                setBalancePrediction(Number(text)); // Set balancePrediction state
                return formik.handleChange("amountPaid")(text); // Update Formik's value
              }}
              onBlur={formik.handleBlur("amountPaid")}
              keyboardType="numeric"
            />
          )}
          {formik.touched.amountPaid && formik.errors.amountPaid ? (
            <Text
              style={[
                {
                  marginBottom: 10,
                  textAlign: "center",
                  color: theme.colors.error,
                },
              ]}
            >
              {formik.errors.amountPaid}
            </Text>
          ) : null}

          {!formik.errors.amountPaid &&
          !!balancePrediction &&
          balanceType !== "settle-up" ? (
            <View style={[commonStyles.rowSection, { marginBottom: 10 }]}>
              <Text
                style={{
                  color: theme.colors.primary,
                  textAlign: "center",
                }}
              >
                The new balance is going to be{"  "}
              </Text>
              <View style={commonStyles.rowSection}>
                <CustomIcon
                  iconName={currency}
                  size={16}
                  color={
                    balanceType === "positive"
                      ? theme.colors.success
                      : theme.colors.error
                  }
                />
                <Text
                  style={{
                    color:
                      balanceType === "positive"
                        ? theme.colors.success
                        : theme.colors.error,
                    fontSize: 16,
                  }}
                >
                  {balanceType === "positive"
                    ? balancePrediction
                    : balancePrediction * -1}
                </Text>
              </View>
            </View>
          ) : null}

          {/* Submit Button */}
          <Button
            title={
              balanceType === "settle-up"
                ? "Confirm Settle Up!"
                : "Confirm New Balance"
            }
            pressHandler={formik.handleSubmit}
            color={theme.colors.primary}
            textColor={theme.colors.buttonText}
            disabled={balanceType === "settle-up" && totalBalance === 0}
          />

          {/* Note text */}
          <Text
            style={[
              {
                color: theme.colors.error,
                textAlign: "center",
                marginVertical: 10,
              },
            ]}
          >
            {balanceType === "settle-up" && totalBalance === 0
              ? "Balance is 0, so settled-up already!"
              : ""}
          </Text>
        </View>
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
    borderRadius: 5,
    fontSize: 16,
    marginTop: 10,
    marginBottom: 15,
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
});
