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
