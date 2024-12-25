// This declaration is required if you want your process.env to be autocompleted.
// This file provides type safety for .env variables. So Node
declare namespace NodeJS {
  interface ProcessEnv {
    EXPO_PUBLIC_ENVIRONMENT: "PROD" | "LOCAL";
    EXPO_PUBLIC_PROD_URL: string;
    EXPO_PUBLIC_STRIPE_PUBLIC_KEY: string;
  }
}
