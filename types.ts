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

export type TransactionT = {
  _id: string;
  transactionDate: Date;
  grossPrice: number;
  totalPrice: number;
  balanceAmount: number;
  items: ItemT[];
  taxPercentage: number;
  amountPaid: number;
};

export type PartialTransactionT = Partial<TransactionT>;

export type ItemT = {
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
  | "home"
  | "logout"
  | "settings"
  | "account-balance-wallet"
  | "phone"
  | "email"
  | "expand-less"
  | "expand-more";
