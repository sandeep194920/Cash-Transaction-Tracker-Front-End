import { APP_URL } from "@/constants/URLs";
import { UserDataT } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Fetch user data from BE based on token
export const fetchUserData = async (): Promise<UserDataT | null> => {
  const token = await AsyncStorage.getItem("token");
  if (!token) {
    return null;
  }
  const response = await axios.get(`${APP_URL}/user-data`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.user || null;
};
