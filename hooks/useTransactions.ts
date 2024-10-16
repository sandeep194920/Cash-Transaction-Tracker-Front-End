import { APP_URL } from "@/constants/URLs";
import { useAppContext } from "@/context/AppContext";
import { TransactionT } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Toast from "react-native-toast-message";

function useTransactions() {
  const queryClient = useQueryClient();
  const { currentCustomer } = useAppContext();
  const { unsettledTransaction } = useAppContext();

  const fetchCustomerTransactions = async (): Promise<TransactionT[]> => {
    if (!currentCustomer?._id) {
      console.log("No customer ID provided");
      return [];
    }
    const token = await AsyncStorage.getItem("token");
    const response = await axios.get(`${APP_URL}/customer/transactions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        customerID: currentCustomer._id,
      },
    });
    return response.data.transactions || [];
  };

  const {
    isLoading: isLoadingTransactions,
    data: customerTransactions,
    // error: transactionsError,
  } = useQuery({
    queryKey: ["customer_transactions"],
    queryFn: fetchCustomerTransactions,
  });

  // Create new transaction
  const addNewTransaction = async () => {
    if (!unsettledTransaction || !currentCustomer) {
      Toast.show({
        type: "error",
        text1: "Something went wrong. Please try again later!",
      });
      return;
    }
    const token = await AsyncStorage.getItem("token");
    const { transactionDate, taxPercentage, amountPaid, items } =
      unsettledTransaction as TransactionT;
    const response = await axios.post(
      `${APP_URL}/add-transaction`,
      {
        transactionDate,
        taxPercentage,
        amountPaid,
        items,
        customerID: currentCustomer._id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  };

  const { mutate: createNewTransaction, isPending } = useMutation({
    mutationFn: addNewTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["add_transaction"] });
      Toast.show({
        type: "success",
        text1: "Transaction added successfully",
      });
    },
    onError: (error: any) => {
      console.log("The error is", error);
      Toast.show({
        type: "error",
        text1: error?.response?.data?.message || "Error adding customer",
      });
    },
  });

  // Return all necessary data and functions
  return {
    isLoadingTransactions,
    customerTransactions,
    createNewTransaction,
    isPending, // TODO: This isPending doesn't work for some reason. Do test it.
  };
}

export default useTransactions;
