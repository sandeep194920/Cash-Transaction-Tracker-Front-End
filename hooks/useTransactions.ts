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
  const { unsettledTransaction, setNewlyAddedTransaction } = useAppContext();
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
    queryKey: ["customer_transactions", currentCustomer?._id],
    queryFn: fetchCustomerTransactions,
    staleTime: 60 * 1000,
  });

  // Create new transaction

  // TODO: (Investigate later why mutation is not working)
  // FOR some reason, the isPending from mutate is not working. So for now, I'll add newTransactionIsLoading use state.

  const addNewTransaction = async () => {
    if (!unsettledTransaction || !currentCustomer?._id) {
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

    /* INFO: Approach 1 - once the new transaction is created, I fetch that new transaction and append it
    with existing transaction. That way, all the new transactions are visible. The advantage of this approach
    is that, I can keep track of newly created transaction ID, and then animate it later to highlight
    that created transaction on the UI

    */

    // onSuccess: (result) => {
    //   queryClient.setQueryData(
    //     ["customer_transactions", currentCustomer?._id],
    //     customerTransactions?.length
    //       ? [...customerTransactions, result.transaction]
    //       : [result.transaction]
    //   );
    //   Toast.show({
    //     type: "success",
    //     text1: "Transaction added successfully",
    //   });
    // },

    /* INFO: Approach 2 - once the new transaction is created, I invalidate the customer_transactions query (above that fetches all the transactions). That way
      it refetches all the transactions again. This is the standard approach, however I like the above one as well
      due to the fact that I can animate and show newly created transaction easily.

    */

    // onSuccess: (result) => {
    //   // queryClient.invalidateQueries(["customer_transactions", currentCustomer?._id]);
    //   queryClient.invalidateQueries({
    //     queryKey: ["customer_transactions", currentCustomer?._id],
    //   });
    //   Toast.show({
    //     type: "success",
    //     text1: "Transaction added successfully",
    //   });
    // },

    /* INFO: Approach 3 - Combination of above 2 approaches */

    onSuccess: (result) => {
      queryClient.invalidateQueries({
        queryKey: ["customer_transactions", currentCustomer?._id],
      });

      setNewlyAddedTransaction(result["transaction"]);

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
  };
}

export default useTransactions;
