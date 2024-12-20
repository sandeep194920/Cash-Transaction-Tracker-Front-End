import { APP_URL } from "@/constants/URLs";
import { useAppContext } from "@/context/AppContext";
import { BalanceAdjustT, TransactionT } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Toast from "react-native-toast-message";
import useCustomers from "./useCustomers";
import useUser from "./useUser";
import { useAuthContext } from "@/context/AuthContext";

function useTransactions() {
  const {
    currentSelectedCustomer,
    setCurrentSelectedCustomer,
    currentSelectedTransaction,
  } = useAppContext();
  const { unsettledTransaction, setNewlyAddedTransaction } = useAppContext();
  const { refetchCustomer, refetchAllCustomers } = useCustomers();
  const { refetchUser } = useUser();
  const { setLoggedInUser } = useAuthContext();

  const queryClient = useQueryClient();
  // Fetch all transactions
  const fetchCustomerTransactions = async (): Promise<TransactionT[]> => {
    if (!currentSelectedCustomer?._id) {
      return [];
    }
    const token = await AsyncStorage.getItem("token");
    const response = await axios.get(`${APP_URL}/customer/transactions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        customerID: currentSelectedCustomer._id,
      },
    });
    return response.data.transactions || [];
  };

  // Fetch single transaction
  const fetchTransaction = async (): Promise<TransactionT | null> => {
    if (!currentSelectedTransaction) {
      return null;
    }
    const token = await AsyncStorage.getItem("token");
    const response = await axios.get(`${APP_URL}/transaction`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        transactionID: currentSelectedTransaction._id,
      },
    });
    return response.data.transaction;
  };

  const {
    isLoading: isLoadingTransactions,
    data: customerTransactions,
    refetch: refetchAllTransactions,
  } = useQuery(
    ["customer_transactions", currentSelectedCustomer?._id],
    fetchCustomerTransactions
  );

  // Create new transaction
  const addNewTransaction = async () => {
    if (!unsettledTransaction || !currentSelectedCustomer?._id) {
      return null;
    }
    console.log(
      "The unsettled transaction that is sent to BE is",
      unsettledTransaction
    );
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
        customerID: currentSelectedCustomer._id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  };

  // Adjust customer balance
  const adjustBalanceAmount = async ({
    balanceType,
    newBalanceAmount,
  }: BalanceAdjustT) => {
    if (!currentSelectedCustomer?._id) {
      return null;
    }
    const token = await AsyncStorage.getItem("token");

    const response = await axios.post(
      `${APP_URL}/update-customer-balance`,
      {
        customerID: currentSelectedCustomer._id,
        newBalanceAmount,
        balanceType,
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
      // refetchAllTransactions is important because, after creating a transaction, we redirect users to trasactions_list page
      // and that new transaction wouldn't be shown if we dont refetchAllTransactions. This is the cleanest way
      // I think instead of appending the new transaction on Frontend and use some useEff to then fetch on screen.
      refetchAllTransactions();
      // refetch customer as well so we get the updated balance after adding a transaction
      // TODO: Investigate why I had to do this refetchCustomer check and not for refetchUser. Match them both so you can remove this if condition
      if (refetchCustomer) {
        const customer = await refetchCustomer();
        if (customer?.data) {
          setCurrentSelectedCustomer(customer.data);
        }
      }

      const user = await refetchUser();
      if (user.data) {
        setLoggedInUser(user.data);
      }

      // TODO: Try to use refetchOnWindowFocus instead of refetchingAllCustomers here. See the comment inside useQuery of "customers" as to why this is necessary
      if (refetchAllCustomers) {
        queryClient.invalidateQueries(["customers"]);
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

  // Adjusting balance is also considered a transaction, so adding it here in this file
  const {
    mutate: adjustCustomerBalance,
    isLoading: isBalanceAdjustLoading,
    isIdle: isBalanceAdjustNotCompleted,
  } = useMutation({
    mutationFn: adjustBalanceAmount,

    onSuccess: async (result) => {
      setNewlyAddedTransaction(result["transaction"]);
      // refetchAllTransactions is important because, after creating a transaction, we redirect users to trasactions_list page
      // and that new transaction wouldn't be shown if we dont refetchAllTransactions. This is the cleanest way
      // I think instead of appending the new transaction on Frontend and use some useEff to then fetch on screen.
      refetchAllTransactions();
      // refetch customer as well so we get the updated balance after adding a transaction
      if (refetchCustomer) {
        const customer = await refetchCustomer();
        if (customer?.data) {
          setCurrentSelectedCustomer(customer.data);
        }
      }

      // TODO: Try to use refetchOnWindowFocus instead of refetchingAllCustomers here. See the comment inside useQuery of "customers" as to why this is necessary
      if (refetchAllCustomers) {
        queryClient.invalidateQueries(["customers"]);
      }

      const user = await refetchUser();
      if (user.data) {
        setLoggedInUser(user.data);
      }

      Toast.show({
        type: "success",
        text1: "Customer Balance adjusted successfully",
      });
    },

    onError: (error: any) => {
      console.log("The error is", error);
      Toast.show({
        type: "error",
        text1: error?.response?.data?.message || "Error adjusting balance",
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
    adjustCustomerBalance,
    isBalanceAdjustLoading,
    isBalanceAdjustNotCompleted,
  };
}

export default useTransactions;
