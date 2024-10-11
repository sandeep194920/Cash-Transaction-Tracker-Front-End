export type AddCustomerT = {
  name: string;
  email: string;
  phone: string;
  address: string;
};

export type CustomerT = {
  _id: string;
  name: string;
  phone: string;
  address: string;
  totalBalance: number;
  user: string;
};
