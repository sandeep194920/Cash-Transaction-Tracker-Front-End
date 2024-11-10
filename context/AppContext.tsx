import { CustomerT, ItemT, PartialTransactionT, TransactionT } from "@/types";
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
  taxPercentage: number;
  unsettledTransaction: PartialTransactionT;
  updateUnsettledTransaction: (values: PartialTransactionT) => void;
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
  taxPercentage: 0,
  unsettledTransaction: { items: [] },
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
  const [taxPercentage, setTaxPercentage] = useState(13);
  const [currentSelectedCustomer, setCurrentSelectedCustomer] =
    useState<CustomerT | null>(null);
  const [currentSelectedTransaction, setCurrentSelectedTransaction] =
    useState<TransactionT | null>(null);
  // If an item is under edit, we need that item to be present in add_item as Formik initialValues

  const [unsettledTransaction, setUnsettledTransaction] =
    useState<PartialTransactionT>({
      items: [],
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

  const updateUnsettledTransaction = (values: PartialTransactionT) => {
    setUnsettledTransaction(() => {
      return { ...unsettledTransaction, ...values };
    });
  };

  const resetAndClearTransaction = () => {
    updateUnsettledTransaction({ items: [], transactionDate: new Date() });
  };

  const appValues = {
    isLoading,
    setIsLoading,
    currentSelectedCustomer,
    setCurrentSelectedCustomer,
    addItem,
    updateItem,
    deleteItem,
    taxPercentage,
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
