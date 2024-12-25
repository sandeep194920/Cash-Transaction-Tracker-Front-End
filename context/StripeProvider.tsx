import { StripeProvider } from "@stripe/stripe-react-native";

type PaymentProviderT = {
  children: React.ReactElement;
};

const PaymentProvider: React.FC<PaymentProviderT> = ({ children }) => {
  return (
    <StripeProvider
      publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLIC_KEY}
      merchantIdentifier="merchant.identifier" // required for Apple Pay
      urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
    >
      {children}
    </StripeProvider>
  );
};

export default PaymentProvider;
