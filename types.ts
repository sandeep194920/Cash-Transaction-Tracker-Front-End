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
  date: string;
  price: number;
  amountPaid: number;
  balanceAmount: number;
};

export type ItemT = {
  name: string;
  price: number;
  quantity: number;
};
