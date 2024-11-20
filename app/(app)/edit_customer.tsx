import React from "react";
import { View, Text, TextInput } from "react-native";
import { useThemeContext } from "@/context/ThemeContext";
import { Formik } from "formik";
import * as Yup from "yup";
import { authStyles } from "@/components/authentication/authStyles";
import { router } from "expo-router";
import useCustomers from "@/hooks/useCustomers";
import { AddCustomerT } from "@/types";
import Button from "@/components/Button";
import HeaderLeftBackArrow from "@/components/HeaderLeftBackArrow";
import Loading from "@/components/Loading";
import { capitalizeStr } from "@/utils/utility";
import { useAppContext } from "@/context/AppContext";
import { commonStyles } from "@/commonStyles";
import Toast from "react-native-toast-message";

// Validation schema for adding a customer
const EditCustomerValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string()
    .matches(/^\d{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
});

const EditCustomerScreen = () => {
  const { theme } = useThemeContext();
  const { editCustomer, isCustomerEditing } = useCustomers();
  const { currentSelectedCustomer } = useAppContext();

  const editCustomerHandler = async (values: AddCustomerT) => {
    if (!editCustomer) return;
    await editCustomer({
      name: capitalizeStr(values.name),
      email: values.email.toLowerCase(),
      phone: values.phone,
      address: values.address,
    });
    Toast.show({
      type: "success",
      text1: "Customer updated successfully",
    });
    router.dismiss();
  };

  if (isCustomerEditing) {
    return <Loading />;
  }

  if (!currentSelectedCustomer) {
    return null;
  }

  const { name, email, phone, address } = currentSelectedCustomer;

  return (
    <>
      <HeaderLeftBackArrow />

      <Formik
        initialValues={{ name, email, phone, address }}
        validationSchema={EditCustomerValidationSchema}
        onSubmit={(values) => {
          editCustomerHandler({
            name: values.name,
            email: values.email,
            phone: values.phone,
            address: values.address,
          });
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View
            style={[
              authStyles.container,
              { backgroundColor: theme.colors.background },
            ]}
          >
            <TextInput
              autoCapitalize="none"
              placeholder="Name *"
              placeholderTextColor={theme.colors.secondaryText}
              style={[
                authStyles.input,
                {
                  backgroundColor: theme.colors.inputBackground,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                },
              ]}
              onChangeText={handleChange("name")}
              onBlur={handleBlur("name")}
              value={values.name}
            />
            {touched.name && errors.name && (
              <Text style={{ color: theme.colors.error, paddingBottom: 10 }}>
                {errors.name}
              </Text>
            )}

            <TextInput
              autoCapitalize="none"
              placeholder="Email *"
              placeholderTextColor={theme.colors.secondaryText}
              style={[
                authStyles.input,
                {
                  backgroundColor: theme.colors.inputBackground,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                },
              ]}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
            />
            {touched.email && errors.email && (
              <Text style={{ color: theme.colors.error, paddingBottom: 10 }}>
                {errors.email}
              </Text>
            )}

            <TextInput
              autoCapitalize="none"
              placeholder="Phone *"
              placeholderTextColor={theme.colors.secondaryText}
              keyboardType="numeric"
              style={[
                authStyles.input,
                {
                  backgroundColor: theme.colors.inputBackground,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                },
              ]}
              onChangeText={handleChange("phone")}
              onBlur={handleBlur("phone")}
              value={values.phone}
            />
            {touched.phone && errors.phone && (
              <Text style={{ color: theme.colors.error, paddingBottom: 10 }}>
                {errors.phone}
              </Text>
            )}

            <TextInput
              autoCapitalize="none"
              placeholder="Address"
              placeholderTextColor={theme.colors.secondaryText}
              style={[
                authStyles.input,
                {
                  backgroundColor: theme.colors.inputBackground,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                },
              ]}
              onChangeText={handleChange("address")}
              onBlur={handleBlur("address")}
              value={values.address}
            />
            <View
              style={[
                commonStyles.rowSection,
                { justifyContent: "space-between" },
              ]}
            >
              <Button
                color={theme.colors.error}
                borderColor={theme.colors.error}
                textColor={theme.colors.buttonText}
                title="Cancel"
                pressHandler={() => {
                  router.dismiss();
                }}
                width={100}
              />

              <Button
                color={theme.colors.primary}
                borderColor={theme.colors.primary}
                textColor={theme.colors.buttonText}
                title="Save Customer"
                pressHandler={handleSubmit}
                width={180}
              />
            </View>
          </View>
        )}
      </Formik>
    </>
  );
};

export default EditCustomerScreen;
