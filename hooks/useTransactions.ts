import { APP_URL } from "@/constants/URLs";
import { useAppContext } from "@/context/AppContext";
import { AddCustomerT, CustomerT, TransactionT } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Toast from "react-native-toast-message";

function useTransactions() {
  const queryClient = useQueryClient();
  const { currentCustomer } = useAppContext();

  const fetchCustomerTransactions = async () => {
    if (!currentCustomer?._id) {
      console.log("No customer ID provided");
      return;
    }
    const token = await AsyncStorage.getItem("token");
    const response = await axios.get(`${APP_URL}/transactions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        customerID: currentCustomer._id,
      },
    });
    return response.data?.customers || [];
  };

  const {
    isLoading: isLoadingTransactions,
    data: customerTransactions,
    error: transactionsError,
  } = useQuery({
    queryKey: ["customer_transactions"],
    queryFn: fetchCustomerTransactions,
  });

  if (transactionsError) {
    Toast.show({
      type: "error",
      text1: transactionsError.message || "An error occurred",
    });
    return {
      success: false,
      message: transactionsError.message || "Error occurred",
    };
  }

  // // Add new customer
  // const addNewTransaction = async ({
  //   date,
  //   grossPrice,
  //   taxPercentage,
  //   totalPrice,
  //   amountPaid,
  //   items,
  // }: TransactionT): Promise<TransactionT> => {
  //   const token = await AsyncStorage.getItem("token");
  //   const response = await axios.post(
  //     `${APP_URL}/add-transaction`,
  //     {
  //       date,
  //       grossPrice,
  //       taxPercentage,
  //       totalPrice,
  //       amountPaid,
  //       items,
  //     },
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     }
  //   );
  //   console.log("reached here");
  //   return response.data;
  // };

  // const { mutate: addTransaction, isPending } = useMutation({
  //   mutationFn: addNewTransaction,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["add_transaction"] });
  //     Toast.show({
  //       type: "success",
  //       text1: "Transaction added successfully",
  //     });
  //   },
  //   onError: (error: any) => {
  //     Toast.show({
  //       type: "error",
  //       text1: error?.response?.data?.message || "Error adding customer",
  //     });
  //   },
  // });

  // Return all necessary data and functions
  return {
    isLoadingTransactions,
    customerTransactions,
    // addTransaction,
    // isPending, // TODO: This isPending doesn't work for some reason. Do test it.
  };
}

export default useTransactions;
