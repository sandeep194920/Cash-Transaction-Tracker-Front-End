import React, { useMemo } from "react";
import { View, Text, TextInput } from "react-native";
import { useThemeContext } from "@/context/ThemeContext";
import { Formik } from "formik";
import * as Yup from "yup";
import { router, useLocalSearchParams } from "expo-router";
import Button from "@/components/Button";
import { ItemT } from "@/types";
import { commonStyles } from "@/commonStyles";
import { useAppContext } from "@/context/AppContext";
import Toast from "react-native-toast-message";
import HeaderLeftBackArrow from "@/components/HeaderLeftBackArrow";
import { v4 as uuidv4 } from "uuid";
import CustomIcon from "@/components/CustomIcon";
import { currency } from "@/constants/Generic";

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
  price: string | number;
  quantity: string | number;
}

const AddItemScreen = () => {
  const { theme } = useThemeContext();
  const { addItem, unsettledTransaction, updateItem } = useAppContext();
  const { itemID } = useLocalSearchParams();

  const formInitialValue = useMemo(() => {
    let foundItem;
    if (itemID && unsettledTransaction.items) {
      foundItem = unsettledTransaction.items.find((item) => item.id === itemID);
      if (foundItem) {
        const { name, price, quantity, id } = foundItem;
        return {
          name,
          price: price,
          quantity: quantity,
          id,
        };
      }
    }
    return { name: "", price: "", quantity: "", id: "" };
  }, [itemID]);

  const addOrUpdateItemHandler = (values: FormValues) => {
    if (itemID) {
      updateItem({
        name: values.name,
        price: +values.price,
        quantity: +values.quantity,
        id: itemID as string,
      });
      router.dismiss();
      return;
    }

    const item: ItemT = {
      id: uuidv4(), // We need id for editting this item on Front-end
      name: values.name,
      price: +values.price,
      quantity: +values.quantity,
    };
    // Probably I need to update the item if it exists
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
        initialValues={formInitialValue}
        validationSchema={addItemValidationSchema}
        onSubmit={addOrUpdateItemHandler}
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
              commonStyles.androidPadding,
              {
                padding: 20,
                paddingVertical: 60,
                backgroundColor: theme.colors.background,
                flex: 1,
              },
            ]}
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
              value={values.price.toString()} // TextInput expects value to be string, so converting it here
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
              value={values.quantity.toString()} // TextInput expects value to be string, so converting it here
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
        {
          backgroundColor: theme.colors.inputBackground,
          marginBottom: 40,
        },
      ]}
    >
      <View style={[commonStyles.rowSection]}>
        <Text style={[{ color: theme.colors.text }]}>{name}</Text>
        <Text style={[{ color: theme.colors.secondaryText }]}>
          {" "}
          ({price} x {quantity})
        </Text>
      </View>
      <View style={commonStyles.rowSection}>
        <View style={commonStyles.rowSection}>
          <CustomIcon
            iconName={currency}
            size={16}
            color={theme.colors.primary}
          />
          <Text style={[{ color: theme.colors.text }]}>
            {+price * +quantity}
          </Text>
        </View>
      </View>
    </View>
  );
};
