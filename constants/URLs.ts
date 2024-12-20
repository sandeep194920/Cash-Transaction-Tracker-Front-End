const URLS = {
  // LOCAL: "http://0.0.0.0:5001",
  LOCAL: "http://10.0.0.77:5001",
  // LOCAL: "http://192.168.0.104:5001",
  // PROD: "https://cash-transaction-tracker-backend.onrender.com", //TODO: Add it after deployment
  PROD: process.env.EXPO_PUBLIC_PROD_URL,
} as const;
type ENV_T = keyof typeof URLS;

const env: ENV_T = (process.env.EXPO_PUBLIC_ENVIRONMENT || "LOCAL") as ENV_T;

export const APP_URL = `${URLS[env]}/api`;
