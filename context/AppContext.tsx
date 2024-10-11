import { APP_URL } from "@/constants/URLs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
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

type CreateContextT = {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  addCustomer: (props: AddCustomerT) => void;
};

const AppContext = createContext<CreateContextT>({
  isLoading: false,
  setIsLoading: (() => {}) as Dispatch<SetStateAction<boolean>>,
  addCustomer: () => {},
});

type AppProviderT = {
  children: React.ReactNode;
};

const AppProvider = ({ children }: AppProviderT) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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

  const appValues = {
    isLoading,
    setIsLoading,
    addCustomer,
  };

  return (
    <AppContext.Provider value={appValues}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};

export default AppProvider;
