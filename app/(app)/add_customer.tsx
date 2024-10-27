import React, { useEffect } from "react";
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

// Validation schema for adding a customer
const addCustomerValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string()
    .matches(/^\d{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
});

const AddCustomerScreen = () => {
  const { theme } = useThemeContext();
  const { addCustomer, isCustomerAdding, isCustomerAddingNotCompleted } =
    useCustomers();

  const addCustomerHandler = (values: AddCustomerT) => {
    if (!addCustomer) return;
    addCustomer({
      name: values.name,
      email: values.email,
      phone: values.phone,
      address: values.address,
    });
  };

  useEffect(() => {
    /*
  
    Initally, isCustomerAdding -> false and isCustomerAddingNotCompleted -> true (so !false and !true) will yield false so the router.dismiss will not run.

    When customer is adding, isCustomerAdding -> true, and isCustomerAddingNotCompleted -> false (so !true and !false ) is false, so it will not run.

    When customer is added, isCustomerAdding -> false and isCustomerAddingNotCompleted -> false (so it will give true)

    */
    if (!isCustomerAdding && !isCustomerAddingNotCompleted) {
      router.dismiss();
    }
  }, [isCustomerAddingNotCompleted, isCustomerAdding]);

  if (isCustomerAdding) {
    return <Loading />;
  }

  return (
    <>
      <HeaderLeftBackArrow />

      <Formik
        initialValues={{ name: "", email: "", phone: "", address: "" }}
        validationSchema={addCustomerValidationSchema}
        onSubmit={(values) => {
          addCustomerHandler({
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

            <Button
              color={theme.colors.primary}
              borderColor={theme.colors.primary}
              textColor={theme.colors.buttonText}
              title="Add Customer"
              pressHandler={handleSubmit}
            />
          </View>
        )}
      </Formik>
    </>
  );
};

export default AddCustomerScreen;
