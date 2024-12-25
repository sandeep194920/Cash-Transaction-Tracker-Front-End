import { Alert, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useThemeContext } from "@/context/ThemeContext";
import CustomIcon from "./CustomIcon";
import Typography from "./Typography";
import { commonStyles } from "@/commonStyles";
import Button from "./Button";
import { appData } from "@/data";
import { useStripe } from "@stripe/stripe-react-native";
import { APP_URL } from "@/constants/URLs";
import Loading from "./Loading";

// NOTE - All the stripe functions are from this stripe react-native documentation - https://docs.stripe.com/payments/accept-a-payment

const Pricing = () => {
  const { theme } = useThemeContext();

  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const fetchPaymentSheetParams = async () => {
    const response = await fetch(`${APP_URL}/payment-sheet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { paymentIntent, ephemeralKey, customer } = await response.json();

    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const initializePaymentSheet = async () => {
    const { paymentIntent, ephemeralKey, customer } =
      await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      merchantDisplayName: "Example, Inc.",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: "Jane Doe",
      },
    });
    if (!error) {
      setLoading(false);
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert("Success", "Your order is confirmed!");
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <View
      style={[
        styles.pricing,
        commonStyles.cardShadow,
        { backgroundColor: theme.colors.border },
      ]}
    >
      <View style={{ gap: 20, marginTop: 10 }}>
        <View style={{ gap: 20 }}>
          <View
            style={{
              borderRadius: 100,
              borderColor: theme.colors.text,
              borderWidth: 1,
            }}
          >
            <Typography
              textCenter
              customStyle={{
                padding: 5,
              }}
              fontSize="small"
            >
              CTT+ Subscription
            </Typography>
          </View>
          <Typography
            fontWeight="bold"
            fontSize="heading"
            color={theme.colors.primary}
          >
            5 CAD / month
          </Typography>
        </View>
        <View style={{ gap: 20, alignItems: "flex-start" }}>
          {appData.subscribeCardFeatures.map((feature) => {
            return (
              <View
                key={feature}
                style={[commonStyles.rowSection, { gap: 10 }]}
              >
                <CustomIcon
                  iconName="check-circle"
                  size={20}
                  color={theme.colors.success}
                />
                <Typography>{feature}</Typography>
              </View>
            );
          })}
        </View>
      </View>
      <Button
        textColor={theme.colors.buttonText}
        pressHandler={openPaymentSheet}
        color={theme.colors.primary}
        title="Subscribe"
        style={{
          marginTop: 20,
          alignSelf: "center",
          borderRadius: 100,
        }}
        width={160}
        height={30}
        fontSize={16}
      />
    </View>
  );
};

export default Pricing;

const styles = StyleSheet.create({
  pricing: {
    margin: "auto",
    marginTop: 20,
    borderWidth: 1,
    padding: 20,
    borderRadius: 10,
  },
});
