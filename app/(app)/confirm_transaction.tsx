import { View, Text, TextInput, StyleSheet } from "react-native";
import { useFormik } from "formik";
import * as yup from "yup";
import Button from "@/components/Button";
import { useThemeContext } from "@/context/ThemeContext";
import { useAppContext } from "@/context/AppContext";
import HeaderLeftBackArrow from "@/components/HeaderLeftBackArrow";
import useTransaction from "@/hooks/useTransaction";
import useTransactions from "@/hooks/useTransactions";

const ConfirmTransactionModal = () => {
  const { theme } = useThemeContext();
  const { currentCustomer } = useAppContext();
  const { transactionTotalAmount, transactionAmountWithTax } = useTransaction();
  //   const { addTransaction } = useTransactions();
  if (!currentCustomer) return;

  const { name, totalBalance: currentBalance } = currentCustomer;

  // Form validation schema using Yup
  const validationSchema = yup.object().shape({
    amountPaid: yup
      .number()
      .required("Amount paid is required")
      .positive("Amount must be positive")
      .max(
        transactionAmountWithTax,
        `Amount cannot exceed ${transactionTotalAmount.toFixed(2)}`
      ),
  });

  // Formik for form handling
  const formik = useFormik({
    initialValues: {
      amountPaid: "",
    },
    validationSchema,
    onSubmit: (values) => {
      // Handle form submission here (e.g., save to server, update state)
      console.log("Amount Paid:", values.amountPaid);
    },
  });

  return (
    <>
      <HeaderLeftBackArrow />
      <View style={styles.modalContainer}>
        <Text style={[styles.label, { color: theme.colors.text }]}>
          Order Amount:
        </Text>
        <Text style={[styles.value, { color: theme.colors.text }]}>
          ${transactionAmountWithTax.toFixed(2)}
        </Text>

        <Text style={[styles.label, { color: theme.colors.text }]}>
          {name}'s Current Balance:
        </Text>
        <Text style={[styles.value, { color: theme.colors.text }]}>
          ${currentBalance.toFixed(2)}
        </Text>

        <Text style={[styles.label, { color: theme.colors.text }]}>
          New Balance:
        </Text>
        <Text style={[styles.value, { color: theme.colors.text }]}>
          ${transactionTotalAmount.toFixed(2)}
        </Text>

        {/* Input field for amount paid */}
        <TextInput
          style={[styles.input, { borderColor: theme.colors.text }]}
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
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 8,
  },
  value: {
    fontSize: 16,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
  },
});

export default ConfirmTransactionModal;
