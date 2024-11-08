import { CustomerT, ItemT, PartialTransactionT, TransactionT } from "@/types";
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
  setCurrentCustomer: Dispatch<SetStateAction<CustomerT | null>>;
  orderedItems: ItemT[];
  addItem: (item: ItemT) => void;
  taxPercentage: number;
  unsettledTransaction: PartialTransactionT;
  updateCurrentTransaction: (values: PartialTransactionT) => void;
  newlyAddedTransaction: TransactionT | null;
  setNewlyAddedTransaction: Dispatch<SetStateAction<TransactionT | null>>;
  newlyAddedCustomer: CustomerT | null;
  setNewlyAddedCustomer: Dispatch<SetStateAction<CustomerT | null>>;
  currentTransaction: TransactionT | null;
  setCurrentTransaction: Dispatch<SetStateAction<TransactionT | null>>;
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
  newlyAddedTransaction: null,
  setNewlyAddedTransaction: (() => {}) as Dispatch<
    SetStateAction<TransactionT | null>
  >,
  newlyAddedCustomer: null,
  setNewlyAddedCustomer: (() => {}) as Dispatch<
    SetStateAction<CustomerT | null>
  >,
  currentTransaction: null,
  setCurrentTransaction: (() => {}) as Dispatch<
    SetStateAction<TransactionT | null>
  >,
});

const AppProvider = ({ children }: AppProviderT) => {
  const [isLoading, setIsLoading] = useState(false);
  const [orderedItems, setOrderedItems] = useState<ItemT[]>([]);
  const [taxPercentage, setTaxPercentage] = useState(13);
  const [currentCustomer, setCurrentCustomer] = useState<CustomerT | null>(
    null
  );
  const [currentTransaction, setCurrentTransaction] =
    useState<TransactionT | null>(null);

  const [unsettledTransaction, setUnsettledTransaction] =
    useState<PartialTransactionT>({
      transactionDate: new Date(),
      taxPercentage: 13,
    });

  // A newly added customer - For showing  on UI - animation purpose
  const [newlyAddedCustomer, setNewlyAddedCustomer] =
    useState<CustomerT | null>(null);

  // A newly added transaction - For showing  on UI - animation purpose
  const [newlyAddedTransaction, setNewlyAddedTransaction] =
    useState<TransactionT | null>(null);

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
    newlyAddedTransaction,
    setNewlyAddedTransaction,
    newlyAddedCustomer,
    setNewlyAddedCustomer,
    currentTransaction,
    setCurrentTransaction,
  };

  return (
    <AppContext.Provider value={appValues}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};

export default AppProvider;
