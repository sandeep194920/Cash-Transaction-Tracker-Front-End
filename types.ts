// Auth and User related
export type UserDataT = {
  _id: string;
  name: string;
  email: string;
  userTotal: number;
};

export type RegisterUserT = {
  name: string;
  email: string;
  password: string;
};

export type VerifyEmailT = {
  email: string;
  code: string;
};

export type LoginUserT = {
  email: string;
  password: string;
};

export type AuthScreensT = "Login" | "Register" | "VerifyEmail";

export type AuthScreensPropsT = {
  showAuthScreen: (screenName: AuthScreensT) => void;
};

// Customer related

export type AddCustomerT = {
  name: string;
  email: string;
  phone: string;
  address: string;
};

export type CustomerT = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalBalance: number;
  user: string;
};
export type BalanceTypeT = "settle-up" | "positive" | "negative";

export type TransactionT = {
  _id: string;
  transactionDate: Date;
  grossPrice: number;
  totalPrice: number;
  balanceAmount: number;
  items: ItemT[];
  taxPercentage: number;
  amountPaid: number;
  // below fields for balanceAdjust
  transactionType: "transaction" | "balanceUpdate";
  balanceType?: "positive" | "negative" | "settle-up";
};

export type BalanceAdjustT = {
  balanceType: BalanceTypeT;
  newBalanceAmount: number;
};

export type MenuT = {
  isMenuVisible: boolean;
  showMenu: () => void;
  hideMenu: () => void;
  editHandler: () => void;
  deleteHandler: () => void;
};

export type UnsettledTransactionT = Partial<
  Omit<TransactionT, "taxPercentage">
> & { taxPercentage: number };

export type ItemT = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export type IconNameT =
  | "dollar"
  | "attach-money"
  | "percent"
  | "more-vert"
  | "person"
  | "add-circle"
  | "house"
  | "home"
  | "logout"
  | "settings"
  | "account-balance-wallet"
  | "phone"
  | "email"
  | "expand-less"
  | "expand-more"
  | "edit"
  | "check";

// Status codes
export type StatusCodesT =
  | "INVALID_CREDENTIALS"
  | "USER_EXISTS"
  | "USER_VERIFIED_ALREADY"
  | "CREATED"
  | "SUCCESS"
  | "SERVER_ERROR"
  | "EMAIL_NOT_VERIFIED"
  | "NOT_FOUND";
