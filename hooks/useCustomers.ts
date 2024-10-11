import { APP_URL } from "@/constants/URLs";
import { AddCustomerT, CustomerT } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Toast from "react-native-toast-message";

function useCustomers() {
  const queryClient = useQueryClient();
  // Fetch customers
  const fetchCustomers = async (): Promise<CustomerT[]> => {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.get(`${APP_URL}/customers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data?.customers || [];
  };

  const {
    isLoading: isLoadingCustomers,
    data: customers,
    error,
  } = useQuery({
    queryKey: ["customers"],
    queryFn: fetchCustomers,
  });

  if (error) {
    Toast.show({
      type: "error",
      text1: error.message || "An error occurred",
    });
    return {
      success: false,
      message: error.message || "Error occurred",
    };
  }

  // Add new customer
  const addNewCustomer = async ({
    name,
    email,
    phone,
    address,
  }: AddCustomerT): Promise<CustomerT> => {
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

  const { mutate: addCustomer, isPending } = useMutation({
    mutationFn: addNewCustomer,
    onSuccess: () => {
      // Invalidate and refetch the customer list when a new customer is added
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
  return {
    addCustomer,
    customers,
    isLoadingCustomers,
    isPending, // TODO: isPending is not working for some reason. Take a closer look later
  };
}

export default useCustomers;
