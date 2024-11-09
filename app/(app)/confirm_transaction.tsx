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

const ConfirmTransactionModal = () => {
  const { theme } = useThemeContext();
  const {
    currentSelectedCustomer,
    updateUnsettledTransaction,
    resetAndClearTransaction,
  } = useAppContext();
  const { orderGrossAmount, orderTotalAmount } = useTransaction();
  const {
    createNewTransaction,
    isTransactionAdding,
    isTransactionAddingNotCompleted,
  } = useTransactions();

  // Form validation schema using Yup
  const validationSchema = yup.object().shape({
    amountPaid: yup
      .number()
      .required("Amount paid is required")
      .positive("Amount must be positive")
      .max(orderTotalAmount, `Amount cannot exceed ${orderTotalAmount}`),
  });

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
      updateUnsettledTransaction({ amountPaid: +amountPaid });
      addTransactionHandler();
    },
  });

  if (!currentSelectedCustomer) return null;
  const { name, totalBalance: currentBalance } = currentSelectedCustomer;

  useEffect(() => {
    /*
  
    Initally, isTransactionAdding -> false and isTransactionAddingNotCompleted -> true (so !false and !true) will yield false so the router.dismiss will not run.

    When transaction is adding, isTransactionAdding -> true, and isTransactionAddingNotCompleted -> false (so !true and !false ) is false, so it will not run.

    When transaction is added, isTransactionAdding -> false and isTransactionAddingNotCompleted -> false (so it will give true)

    */
    if (!isTransactionAdding && !isTransactionAddingNotCompleted) {
      router.navigate("/(app)/customer_transactions_list");
      // the below line resets the transaction to initial state
      resetAndClearTransaction();
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
          commonStyles.flex1,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <Text style={[styles.label, { color: theme.colors.text }]}>
          Order Amount:
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
            {orderGrossAmount}
          </Text>
        </View>
        <View style={[commonStyles.rowSection, styles.textContainer]}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            {name}'s Current Balance:
          </Text>
          <Text style={[styles.subText, { color: theme.colors.text }]}>
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
            {currentBalance}
          </Text>
        </View>
        <View style={[commonStyles.rowSection, styles.textContainer]}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            New Balance:
          </Text>
          <Text style={[styles.subText, { color: theme.colors.text }]}>
            (Including this order)
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
            {orderTotalAmount}
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
