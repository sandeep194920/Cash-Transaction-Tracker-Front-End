import { CustomerT, ItemT, UnsettledTransactionT, TransactionT } from "@/types";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { cloneDeep } from "lodash";

type AppProviderT = {
  children: React.ReactNode;
};

type CreateContextT = {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  currentSelectedCustomer: CustomerT | null;
  setCurrentSelectedCustomer: Dispatch<SetStateAction<CustomerT | null>>;
  addItem: (item: ItemT) => void;
  updateItem: (item: ItemT) => void;
  deleteItem: ({ itemID }: { itemID: string }) => void;
  unsettledTransaction: UnsettledTransactionT;
  updateUnsettledTransaction: (values: UnsettledTransactionT) => void;
  resetAndClearTransaction: () => void;
  newlyAddedTransaction: TransactionT | null;
  setNewlyAddedTransaction: Dispatch<SetStateAction<TransactionT | null>>;
  newlyAddedCustomer: CustomerT | null;
  setNewlyAddedCustomer: Dispatch<SetStateAction<CustomerT | null>>;
  currentSelectedTransaction: TransactionT | null;
  setCurrentSelectedTransaction: Dispatch<SetStateAction<TransactionT | null>>;
};

const AppContext = createContext<CreateContextT>({
  isLoading: false,
  setIsLoading: (() => {}) as Dispatch<SetStateAction<boolean>>,
  currentSelectedCustomer: null,
  setCurrentSelectedCustomer: (() => {}) as Dispatch<
    React.SetStateAction<CustomerT | null>
  >,
  addItem: () => {},
  updateItem: () => {},
  deleteItem: () => {},
  unsettledTransaction: { items: [], taxPercentage: 0 },
  updateUnsettledTransaction: () => {},
  resetAndClearTransaction: () => {},
  newlyAddedTransaction: null,
  setNewlyAddedTransaction: (() => {}) as Dispatch<
    SetStateAction<TransactionT | null>
  >,
  newlyAddedCustomer: null,
  setNewlyAddedCustomer: (() => {}) as Dispatch<
    SetStateAction<CustomerT | null>
  >,
  currentSelectedTransaction: null,
  setCurrentSelectedTransaction: (() => {}) as Dispatch<
    SetStateAction<TransactionT | null>
  >,
});

const AppProvider = ({ children }: AppProviderT) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentSelectedCustomer, setCurrentSelectedCustomer] =
    useState<CustomerT | null>(null);
  const [currentSelectedTransaction, setCurrentSelectedTransaction] =
    useState<TransactionT | null>(null);
  const [unsettledTransaction, setUnsettledTransaction] =
    useState<UnsettledTransactionT>({
      items: [],
      transactionDate: new Date(),
      taxPercentage: 0, // Default is 0. We can change this in settings page
    });

  // A newly added customer - For showing  on UI - animation purpose
  const [newlyAddedCustomer, setNewlyAddedCustomer] =
    useState<CustomerT | null>(null);

  // A newly added transaction - For showing  on UI - animation purpose
  const [newlyAddedTransaction, setNewlyAddedTransaction] =
    useState<TransactionT | null>(null);

  // TRANSACTION FUNCTIONS
  const addItem = ({ name, price, quantity, id }: ItemT) => {
    // Let's do the below deep-copy using lodash

    // setUnsettledTransaction((prevState) => {
    //   return {
    //     ...prevState,
    //     items: [
    //       ...(prevState.items ? prevState.items : []),
    //       { name, quantity, price },
    //     ],
    //   };
    // });

    setUnsettledTransaction((prevState) => {
      // Use cloneDeep to create a deep copy of prevState
      const updatedState = cloneDeep(prevState);

      // Push the new item to the cloned items array
      updatedState.items = [
        ...(updatedState.items ? updatedState.items : []),
        { name, quantity, price, id },
      ];

      // Return the updated state with the new item added
      return updatedState;
    });
  };

  const updateItem = ({ name, price, quantity, id }: ItemT) => {
    setUnsettledTransaction((prevState) => {
      // Create a deep copy of the previous state
      const updatedState = cloneDeep(prevState);

      updatedState.items?.map((item) => {
        if (item.id === id) {
          item.name = name;
          item.price = price;
          item.quantity = quantity;
        }
        return item;
      });

      // Return the updated state with the modified item
      return updatedState;
    });
  };

  const deleteItem = ({ itemID }: { itemID: string }) => {
    setUnsettledTransaction((prevState) => {
      // Create a deep copy of the previous state
      const updatedState = cloneDeep(prevState);

      updatedState.items = updatedState.items?.filter(
        (item) => item.id !== itemID
      );

      // Return the updated state with the modified item
      return updatedState;
    });
  };

  const updateUnsettledTransaction = (values: UnsettledTransactionT) => {
    setUnsettledTransaction(() => {
      return { ...unsettledTransaction, ...values };
    });
  };

  const resetAndClearTransaction = () => {
    updateUnsettledTransaction({
      taxPercentage: unsettledTransaction.taxPercentage,
      items: [],
      transactionDate: new Date(),
    });
  };

  const appValues = {
    isLoading,
    setIsLoading,
    currentSelectedCustomer,
    setCurrentSelectedCustomer,
    addItem,
    updateItem,
    deleteItem,
    unsettledTransaction,
    updateUnsettledTransaction,
    resetAndClearTransaction,
    newlyAddedTransaction,
    setNewlyAddedTransaction,
    newlyAddedCustomer,
    setNewlyAddedCustomer,
    currentSelectedTransaction,
    setCurrentSelectedTransaction,
  };

  return (
    <AppContext.Provider value={appValues}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};

export default AppProvider;
