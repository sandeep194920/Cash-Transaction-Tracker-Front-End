import { View, Text, TextInput, StyleSheet } from "react-native";
import { useFormik } from "formik";
import * as yup from "yup";
import Button from "@/components/Button";
import { useThemeContext } from "@/context/ThemeContext";
import { useAppContext } from "@/context/AppContext";
import HeaderLeftBackArrow from "@/components/HeaderLeftBackArrow";
import useTransactions from "@/hooks/useTransactions";
import { router } from "expo-router";
import { useEffect } from "react";
import Loading from "@/components/Loading";
import { commonStyles } from "@/commonStyles";
import useTransaction from "@/hooks/useTransaction";
import CustomIcon from "@/components/CustomIcon";
import { currency } from "@/constants/Generic";

// Form validation schema using Yup
const validationSchema = yup.object().shape({
  amountPaid: yup
    .number()
    .required("Amount paid is required")
    .min(0, "Amount must be at least 0"),
  // .positive("Amount must be positive"), // INFO: This would expect min to be 1, so commenting this out and adding .min here
});

const ConfirmTransactionModal = () => {
  const { theme } = useThemeContext();
  const {
    currentSelectedCustomer,
    unsettledTransaction,
    updateUnsettledTransaction,
    resetAndClearTransaction,
  } = useAppContext();
  const { orderTotalAmount } = useTransaction();
  const {
    createNewTransaction,
    isTransactionAdding,
    isTransactionAddingNotCompleted,
  } = useTransactions();

  if (!currentSelectedCustomer) return null;
  const { name, totalBalance: currentBalance } = currentSelectedCustomer;

  const addTransactionHandler = async () => {
    if (createNewTransaction) {
      createNewTransaction();
      // don't reset transaction here. Better do it in useEff below after transaction gets updated successfully
    }
    /*route. navigate is the best option here (instead of replace/push)- When it navigates back to customer_transactions_list, it removes other
       underlying routes and gives proper way to go back (back button) from transactions screen to customers screen*/
    // router.navigate("/(app)/customer_transactions_list");
  };

  // Formik for form handling
  const formik = useFormik({
    initialValues: {
      amountPaid: "",
    },
    validationSchema,
    onSubmit: (values) => {
      const { amountPaid } = values;
      updateUnsettledTransaction({
        ...unsettledTransaction,
        amountPaid: +amountPaid,
      });
      addTransactionHandler();
    },
  });

  useEffect(() => {
    /*
  
    Initally, isTransactionAdding -> false and isTransactionAddingNotCompleted -> true (so !false and !true) will yield false so the below code will not run.

    When transaction is adding, isTransactionAdding -> true, and isTransactionAddingNotCompleted -> false (so !true and !false ) is false, so it will not run.

    When transaction is added, isTransactionAdding -> false and isTransactionAddingNotCompleted -> false (so it will give true)

    */
    if (!isTransactionAdding && !isTransactionAddingNotCompleted) {
      router.navigate("/(app)/customer_transactions_list");
      // the below line resets the transaction to initial state
      resetAndClearTransaction();
      // TODO: See how confirm_transaction is closing without adding router.dismiss()
    }
  }, [isTransactionAdding, isTransactionAddingNotCompleted]);

  if (isTransactionAdding) {
    return <Loading />;
  }

  return (
    <>
      <HeaderLeftBackArrow />
      <View
        style={[
          styles.modalContainer,
          commonStyles.androidPadding,
          commonStyles.flex1,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <Text style={[styles.label, { color: theme.colors.text }]}>
          Today's Total Amount:
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
            {orderTotalAmount.toFixed(2)}
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
            {name}'s Current Balance:
          </Text>
          <Text style={[styles.subText, { color: theme.colors.primary }]}>
            (Excluding this order)
          </Text>
        </View>
        <View
          style={[commonStyles.rowSection, { justifyContent: "flex-start" }]}
        >
          <CustomIcon
            iconName={currency}
            size={16}
            color={theme.colors.primary}
          />
          <Text style={[styles.value, { color: theme.colors.text }]}>
            {currentBalance.toFixed(2)}
          </Text>
        </View>

        <View
          style={[
            {
              height: 0.4,
              backgroundColor: theme.colors.primary,
              marginTop: 10,
            },
          ]}
        />
        <View
          style={[
            commonStyles.rowSection,
            styles.textContainer,
            { flexWrap: "wrap" },
          ]}
        >
          <Text style={[styles.label, { color: theme.colors.text }]}>
            New Balance:
          </Text>
          <Text style={[styles.subText, { color: theme.colors.primary }]}>
            (Including this order)
          </Text>
        </View>

        <View
          style={[commonStyles.rowSection, { justifyContent: "flex-start" }]}
        >
          <CustomIcon
            iconName={currency}
            size={18}
            color={theme.colors.primary}
          />
          <Text
            style={[
              styles.value,
              {
                color:
                  orderTotalAmount + currentBalance > 0
                    ? theme.colors.error
                    : theme.colors.success,
                fontWeight: "700",
                fontSize: 18,
              },
            ]}
          >
            {(orderTotalAmount + currentBalance).toFixed(2)}
          </Text>
        </View>

        {/* Input field for amount paid */}
        <TextInput
          style={[
            styles.input,
            {
              borderColor: theme.colors.secondaryText,
              color: theme.colors.text,
            },
          ]}
          placeholder="Enter Amount Paid Today"
          placeholderTextColor={theme.colors.secondaryText}
          value={formik.values.amountPaid}
          onChangeText={formik.handleChange("amountPaid")}
          onBlur={formik.handleBlur("amountPaid")}
          keyboardType="numeric"
        />
        {formik.touched.amountPaid && formik.errors.amountPaid ? (
          <Text style={styles.errorText}>{formik.errors.amountPaid}</Text>
        ) : null}

        {/* Submit Button */}
        <Button
          title="Confirm Transaction"
          pressHandler={formik.handleSubmit}
          color={theme.colors.primary}
          textColor={theme.colors.buttonText}
        />
      </View>
    </>
  );
};

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
    fontSize: 12,
  },
  textContainer: {
    justifyContent: "flex-start",
    gap: 4,
    alignItems: "center",
  },
});

export default ConfirmTransactionModal;
