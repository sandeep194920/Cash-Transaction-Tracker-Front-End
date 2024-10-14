import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useThemeContext } from "@/context/ThemeContext";
import { Formik } from "formik";
import * as Yup from "yup";
import { router } from "expo-router";
import Button from "@/components/Button";
import { ItemT } from "@/types";
import { commonStyles } from "@/commonStyles";
import { useAppContext } from "@/context/AppContext";
import Toast from "react-native-toast-message";
import HeaderLeftBackArrow from "@/components/HeaderLeftBackArrow";

// Validation schema for adding an item
const addItemValidationSchema = Yup.object().shape({
  name: Yup.string().required("Item name is required"),
  price: Yup.number()
    .typeError("Price must be a number")
    .positive("Price must be greater than zero")
    .required("Price is required"),
  quantity: Yup.number()
    .typeError("Quantity must be a number")
    .integer("Quantity must be an integer")
    .positive("Quantity must be greater than zero")
    .required("Quantity is required"),
});

// Define form values type for TypeScript
interface FormValues {
  name: string;
  price: string;
  quantity: string;
}

const AddItemScreen = () => {
  const { theme } = useThemeContext();
  const { addItem } = useAppContext();

  // Submit handler
  const addItemHandler = (values: FormValues) => {
    const item: ItemT = {
      name: values.name,
      price: parseFloat(values.price), // Convert to number
      quantity: parseInt(values.quantity, 10), // Convert to integer
    };

    // Use the item object as needed
    addItem(item);
    router.dismiss();
    Toast.show({
      type: "success",
      text1: "Item added successfully!",
      text2: "Add your next item",
    });
  };

  return (
    <>
      <HeaderLeftBackArrow />

      <Formik
        initialValues={{ name: "", price: "", quantity: "" }}
        validationSchema={addItemValidationSchema}
        onSubmit={addItemHandler}
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
            style={{
              padding: 20,
              paddingVertical: 60,
              backgroundColor: theme.colors.background,
              flex: 1,
            }}
          >
            {/* As soon as Item name is added, we should display the card below */}
            {values.name && values.price && values.quantity && (
              <ItemAdded
                name={values.name}
                price={values.price}
                quantity={values.quantity}
              />
            )}

            {/* Item Name Input */}
            <TextInput
              placeholder="Item Name *"
              placeholderTextColor={theme.colors.secondaryText}
              style={{
                backgroundColor: theme.colors.inputBackground,
                color: theme.colors.text,
                borderColor: theme.colors.border,
                borderWidth: 1,
                padding: 10,
                marginBottom: 10,
              }}
              onChangeText={handleChange("name")}
              onBlur={handleBlur("name")}
              value={values.name}
            />
            {touched.name && errors.name && (
              <Text style={{ color: theme.colors.error, marginBottom: 10 }}>
                {errors.name}
              </Text>
            )}

            {/* Price Input */}
            <TextInput
              placeholder="Price per Item *"
              placeholderTextColor={theme.colors.secondaryText}
              style={{
                backgroundColor: theme.colors.inputBackground,
                color: theme.colors.text,
                borderColor: theme.colors.border,
                borderWidth: 1,
                padding: 10,
                marginBottom: 10,
              }}
              onChangeText={handleChange("price")}
              onBlur={handleBlur("price")}
              value={values.price}
              keyboardType="numeric"
            />
            {touched.price && errors.price && (
              <Text style={{ color: theme.colors.error, marginBottom: 10 }}>
                {errors.price}
              </Text>
            )}

            {/* Quantity Input */}
            <TextInput
              placeholder="Quantity *"
              placeholderTextColor={theme.colors.secondaryText}
              style={{
                backgroundColor: theme.colors.inputBackground,
                color: theme.colors.text,
                borderColor: theme.colors.border,
                borderWidth: 1,
                padding: 10,
                marginBottom: 10,
              }}
              onChangeText={handleChange("quantity")}
              onBlur={handleBlur("quantity")}
              value={values.quantity}
              keyboardType="numeric"
            />
            {touched.quantity && errors.quantity && (
              <Text style={{ color: theme.colors.error, marginBottom: 10 }}>
                {errors.quantity}
              </Text>
            )}

            {/* Buttons */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 20,
              }}
            >
              <Button
                width={130}
                height={35}
                fontSize={16}
                textColor={theme.colors.buttonText}
                color={theme.colors.error}
                title="Cancel"
                pressHandler={() => router.dismiss()}
              />
              <Button
                width={130}
                height={35}
                fontSize={16}
                color={theme.colors.primary}
                borderColor={theme.colors.primary}
                textColor={theme.colors.buttonText}
                title="Add Item"
                pressHandler={handleSubmit}
              />
            </View>
          </View>
        )}
      </Formik>
    </>
  );
};

export default AddItemScreen;

const ItemAdded = ({ name, quantity, price }: FormValues) => {
  const { theme } = useThemeContext();
  return (
    <View
      style={[
        commonStyles.card,
        commonStyles.cardRow,
        { backgroundColor: theme.colors.inputBackground, marginBottom: 40 },
      ]}
    >
      <View style={commonStyles.rowSection}>
        <Text style={[{ color: theme.colors.text }]}>{name}</Text>
        <Text style={[{ color: theme.colors.secondaryText }]}>
          {" "}
          ({price} x {quantity})
        </Text>
      </View>
      <View style={commonStyles.rowSection}>
        <Text style={[{ color: theme.colors.text }]}>
          ${+price * +quantity}
        </Text>
      </View>
    </View>
  );
};
