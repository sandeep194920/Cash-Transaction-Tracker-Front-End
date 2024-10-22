const URLS = {
  LOCAL: "http://192.168.29.210:5001",
  // LOCAL: "http://192.168.0.104:5001",
  PROD: "", //TODO: Add it after deployment
} as const;

type ENV_T = keyof typeof URLS;

const env: ENV_T = (process.env.EXPO_PUBLIC_ENVIRONMENT || "LOCAL") as ENV_T;

export const APP_URL = `${URLS[env]}/api`;
