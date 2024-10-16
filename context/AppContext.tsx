import { CustomerT, ItemT, PartialTransactionT } from "@/types";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

type AppProviderT = {
  children: React.ReactNode;
};

type CreateContextT = {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  currentCustomer: CustomerT | null;
  setCurrentCustomer: Dispatch<React.SetStateAction<CustomerT | null>>;
  orderedItems: ItemT[];
  addItem: (item: ItemT) => void;
  taxPercentage: number;
  unsettledTransaction: PartialTransactionT;
  updateCurrentTransaction: (values: PartialTransactionT) => void;
};

const AppContext = createContext<CreateContextT>({
  isLoading: false,
  setIsLoading: (() => {}) as Dispatch<SetStateAction<boolean>>,
  currentCustomer: null,
  setCurrentCustomer: (() => {}) as Dispatch<
    React.SetStateAction<CustomerT | null>
  >,
  orderedItems: [],
  addItem: () => {},
  taxPercentage: 0,
  unsettledTransaction: {},
  updateCurrentTransaction: () => {},
});

const AppProvider = ({ children }: AppProviderT) => {
  const [isLoading, setIsLoading] = useState(false);
  const [orderedItems, setOrderedItems] = useState<ItemT[]>([]);
  const [taxPercentage, setTaxPercentage] = useState(13);
  const [currentCustomer, setCurrentCustomer] = useState<null | CustomerT>(
    null
  );

  const [unsettledTransaction, setUnsettledTransaction] =
    useState<PartialTransactionT>({
      transactionDate: new Date(),
      taxPercentage: 13,
    });

  // TRANSACTION FUNCTIONS
  const addItem = ({ name, price, quantity }: ItemT) => {
    setOrderedItems((prevItems) => {
      return [
        ...prevItems,
        {
          name,
          quantity,
          price,
        },
      ];
    });
  };

  const updateCurrentTransaction = (values: PartialTransactionT) => {
    setUnsettledTransaction(() => {
      return { ...unsettledTransaction, ...values };
    });
  };

  const appValues = {
    isLoading,
    setIsLoading,
    currentCustomer,
    setCurrentCustomer,
    orderedItems,
    addItem,
    taxPercentage,
    unsettledTransaction,
    updateCurrentTransaction,
  };

  return (
    <AppContext.Provider value={appValues}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};

export default AppProvider;
