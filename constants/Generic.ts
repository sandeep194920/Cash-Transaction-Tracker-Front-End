import { BalanceTypeT } from "@/types";

export const VERIFY_EMAIL_TIMER = 5 * 60; // 5 mins

export const currency = "attach-money";

export const balanceTypeDescriptions: Record<BalanceTypeT, string> = {
  "settle-up": "Settle Up",
  "balance-remaining": "Partially paid",
  overpaying: "Overpaid",
};
