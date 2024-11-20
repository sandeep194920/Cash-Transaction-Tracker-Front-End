import { APP_URL } from "@/constants/URLs";
import { useAppContext } from "@/context/AppContext";
import { AddCustomerT, CustomerT } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Toast from "react-native-toast-message";

function useCustomers() {
  const queryClient = useQueryClient();
  const { currentSelectedCustomer, setNewlyAddedCustomer } = useAppContext();

  // Fetch all customers
  const fetchCustomers = async (): Promise<CustomerT[]> => {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.get(`${APP_URL}/customers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.customers || [];
  };

  // Fetch single customer
  const fetchCustomer = async (): Promise<CustomerT | null> => {
    if (!currentSelectedCustomer) {
      return null;
    }
    const token = await AsyncStorage.getItem("token");
    const response = await axios.get(`${APP_URL}/customer`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        customerID: currentSelectedCustomer._id,
      },
    });
    return response.data.customer;
  };

  const {
    isLoading: isLoadingCustomers,
    data: customers,
    error: customersError,
    refetch: refetchAllCustomers,
  } = useQuery(["customers"], fetchCustomers);

  // Handle errors after all hooks are called
  if (customersError) {
    Toast.show({
      type: "error",
      text1: "An error occurred",
    });
    return {
      success: false,
      message: "Error occurred",
    };
  }

  // Add new customer
  const addNewCustomer = async ({
    name,
    email,
    phone,
    address,
  }: AddCustomerT): Promise<{ customer: CustomerT }> => {
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
    return response.data;
  };

  const {
    mutate: addCustomer,
    isLoading: isCustomerAdding,
    isIdle: isCustomerAddingNotCompleted,
  } = useMutation({
    mutationFn: addNewCustomer,
    onSuccess: async (result) => {
      setNewlyAddedCustomer(result["customer"]);
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      Toast.show({
        type: "success",
        text1: "Customer added successfully",
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: error?.response?.data?.message || "Error adding customer",
      });
    },
  });

  // Get single customer query
  const {
    isLoading: isLoadingCustomer,
    data: customer,
    error: customerError,
    refetch: refetchCustomer,
  } = useQuery(["customer"], fetchCustomer);

  if (customerError) {
    Toast.show({
      type: "error",
      text1: "An error occurred",
    });
    return {
      success: false,
      message: "Error occurred",
    };
  }

  // Edit existing customer

  // Add new customer
  const editExistingCustomer = async ({
    name,
    email,
    phone,
    address,
  }: AddCustomerT): Promise<{ customer: CustomerT } | null> => {
    if (!currentSelectedCustomer) {
      return null;
    }
    const token = await AsyncStorage.getItem("token");
    const response = await axios.post(
      `${APP_URL}/edit-customer`,
      {
        customerID: currentSelectedCustomer._id,
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
    return response.data;
  };

  const { mutateAsync: editCustomer, isLoading: isCustomerEditing } =
    useMutation({
      mutationFn: editExistingCustomer,
      onSuccess: async (result) => {
        queryClient.invalidateQueries({
          queryKey: ["customers"],
        });
      },
      onError: (error: any) => {
        Toast.show({
          type: "error",
          text1: error?.response?.data?.message || "Error updating customer",
        });
      },
    });

  return {
    customers,
    isLoadingCustomers,
    customer,
    isLoadingCustomer,
    addCustomer,
    refetchCustomer,
    refetchAllCustomers,
    isCustomerAdding,
    isCustomerAddingNotCompleted,
    editCustomer,
    isCustomerEditing,
  };
}

export default useCustomers;
