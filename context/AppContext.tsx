import { APP_URL } from "@/constants/URLs";
import { CustomerT, ItemT, PartialTransactionT } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import Toast from "react-native-toast-message";

type AddCustomerT = {
  name: string;
  email: string;
  phone: string;
  address: string;
};

type AppProviderT = {
  children: React.ReactNode;
};

type CreateContextT = {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  addCustomer: (props: AddCustomerT) => void;
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
  addCustomer: () => {},
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

  // CUSTOMER FUNCTIONS
  const addCustomer = async ({ name, email, phone, address }: AddCustomerT) => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await axios.post(
        `${APP_URL}/add-customer`,
        {
          name,
          email,
          phone,
          address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        Toast.show({
          type: "success",
          text1: "Customer added successfully",
        });
        router.dismiss();
        return {
          success: true,
          message: response.data.message,
        };
      }
      return {
        success: false,
        message: "Failed to add customer",
      };
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error.response?.data.message || "An error occurred",
      });
      return {
        success: false,
        message: error.response?.data.message || "Error occurred",
      };
    } finally {
      setIsLoading(false);
    }
  };

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
    addCustomer,
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
