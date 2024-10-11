import { APP_URL } from "@/constants/URLs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import Toast from "react-native-toast-message";

type UserDataT = {
  name: string;
  email: string;
  phone: string;
};

type CreateContextT = {
  isLoggedIn: boolean;
  authenticateUser: (state?: boolean, token?: string) => void;
  registeredUnverifiedUser: string;
  setUnverifiedUser: (email: string) => void;
  userData: UserDataT | null;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};

const AuthContext = createContext<CreateContextT>({
  isLoggedIn: false,
  authenticateUser:
    (state?: boolean, token = "") =>
    () => {},
  registeredUnverifiedUser: "",
  setUnverifiedUser: (email: string) => () => {},
  userData: null,
  isLoading: false,
  setIsLoading: (() => {}) as Dispatch<SetStateAction<boolean>>,
});

type AuthProviderT = {
  children: React.ReactNode;
};

const AuthProvider = ({ children }: AuthProviderT) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [registeredUnverifiedUser, setRegisteredUnverifiedUser] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<UserDataT | null>(null);

  // Fetch user data from BE based on token
  const fetchUserData = async (token: string) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${APP_URL}/user-data`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserData(response.data as UserDataT); // Set user data
    } catch (error) {
      console.log("Failed to fetch user data", error);
      Toast.show({
        type: "error",
        text1: "Sorry, something went wrong. Please try again later",
      });
      // Optionally handle errors, such as invalid token
    } finally {
      setIsLoading(false); // Stop loading indicator
    }
  };

  const authenticateUser = async (loginState = true, token = "") => {
    setIsLoggedIn(loginState);
    if (loginState && token) {
      await AsyncStorage.setItem("token", token); // Save token to AsyncStorage
      fetchUserData(token); // Fetch user data after login
    } else {
      await AsyncStorage.removeItem("token");
      setUserData(null); // Clear user data on logout
    }
  };

  // Check if token exists on app load (useEffect hook)
  useEffect(() => {
    const checkUserSession = async () => {
      setIsLoading(true); // Show loading indicator while checking
      const token = await AsyncStorage.getItem("token"); // Get token from AsyncStorage
      if (token) {
        setIsLoggedIn(true);
        await fetchUserData(token); // Fetch user data if token exists
      } else {
        setIsLoading(false); // Stop loading if no token is found
      }
    };

    checkUserSession(); // Call the session check function when app loads
  }, []);

  const setUnverifiedUser = (email: string) => {
    setRegisteredUnverifiedUser(email);
  };

  const appValues = {
    isLoggedIn,
    authenticateUser,
    registeredUnverifiedUser,
    setUnverifiedUser,
    userData,
    isLoading,
    setIsLoading,
  };

  return (
    <AuthContext.Provider value={appValues}>{children}</AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
