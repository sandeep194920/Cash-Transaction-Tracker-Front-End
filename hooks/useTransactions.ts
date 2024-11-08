import { APP_URL } from "@/constants/URLs";
import { useAppContext } from "@/context/AppContext";
import { TransactionT } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Toast from "react-native-toast-message";
import useCustomers from "./useCustomers";

function useTransactions() {
  const { currentCustomer, setCurrentCustomer, currentTransaction } =
    useAppContext();
  const {
    unsettledTransaction,
    setNewlyAddedTransaction,
    setCurrentTransaction,
    // resetCurrentTransaction,
  } = useAppContext();
  const { refetchCustomer } = useCustomers();

  // Fetch all transactions
  const fetchCustomerTransactions = async (): Promise<TransactionT[]> => {
    if (!currentCustomer?._id) {
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

  // Fetch single transaction
  const fetchTransaction = async (): Promise<TransactionT | null> => {
    if (!currentTransaction) {
      return null;
    }
    const token = await AsyncStorage.getItem("token");
    const response = await axios.get(`${APP_URL}/transaction`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        transactionID: currentTransaction._id,
      },
    });
    return response.data.transaction;
  };

  const {
    isLoading: isLoadingTransactions,
    data: customerTransactions,
    refetch: refetchAllTransactions,
  } = useQuery(
    ["customer_transactions", currentCustomer?._id],
    fetchCustomerTransactions
  );

  // Create new transaction
  const addNewTransaction = async () => {
    if (!unsettledTransaction || !currentCustomer?._id) {
      return null;
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

  const {
    mutate: createNewTransaction,
    isLoading: isTransactionAdding,
    isIdle: isTransactionAddingNotCompleted,
  } = useMutation({
    mutationFn: addNewTransaction,

    onSuccess: async (result) => {
      setNewlyAddedTransaction(result["transaction"]);
      refetchAllTransactions();
      // refetch customer as well so we get the updated balance after adding a transaction
      if (refetchCustomer) {
        const customer = await refetchCustomer();
        if (customer?.data) {
          setCurrentCustomer(customer.data);
        }
      }
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

  // Get single transaction query
  const {
    isLoading: isLoadingTransaction,
    data: transaction,
    error: transactionError,
    refetch: refetchTransaction,
  } = useQuery(["transaction"], fetchTransaction);

  if (transactionError) {
    Toast.show({
      type: "error",
      text1: "An error occurred",
    });
    return {
      success: false,
      message: "Error occurred",
    };
  }

  return {
    isLoadingTransactions,
    isLoadingTransaction,
    transaction,
    refetchTransaction,
    customerTransactions,
    createNewTransaction,
    isTransactionAdding,
    isTransactionAddingNotCompleted,
  };
}

export default useTransactions;
