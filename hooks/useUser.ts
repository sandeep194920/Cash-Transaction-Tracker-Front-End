import { APP_URL } from "@/constants/URLs";
import { useAuthContext } from "@/context/AuthContext";
import { LoginUserT, RegisterUserT, VerifyEmailT } from "@/types";
import { fetchUserData } from "@/utils/fetchUser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useMemo } from "react";

/* Contains following functions

Fetch User Data
Register and Login and Logout user
Verify and send verification emails
*/

const useUser = () => {
  const {
    setEmailTryingToAuthenticate,
    setLoggedInUser,
    loggedInUser,
    setIsLoading,
  } = useAuthContext();

  const loggedInUserID = useMemo(() => loggedInUser?._id, [loggedInUser]);

  // User registration
  const register = async ({ name, email, password }: RegisterUserT) => {
    const response = await axios.post(`${APP_URL}/register-user`, {
      name,
      email,
      password,
    });
    return response;
  };

  // mutateAsync returns a promise so that I can await inside Register's register function/
  // whereas mutate doesn't return a promise
  // we might need mutateAsync if we want to do something after onSuccess in some other component like Register (in this case we want to send the user to verify email page)
  const { mutateAsync: registerUser, isLoading: isUserRegistering } =
    useMutation({
      mutationFn: register,
      onSuccess: (API_RESPONSE, args) => {
        // data is the returned data from registerUser, and variables is the args passed to mutationFunction
        setEmailTryingToAuthenticate(args.email);
        return {
          data: API_RESPONSE.data,
          status: API_RESPONSE.status,
        };
      },
      onError: (error) => {
        return error;
      },
    });

  // Verify Email
  const verifyEmail = async ({ email, code }: VerifyEmailT) => {
    const response = await axios.post(`${APP_URL}/verify-email`, {
      email,
      verificationCode: code,
    });
    return response;
  };

  const {
    mutateAsync: verifyUserEmail,
    isLoading: isEmailVerifying,
    isIdle: isVerificationNotCompleted,
  } = useMutation({
    mutationFn: verifyEmail,
    onSuccess: async (API_RESPONSE) => {
      await AsyncStorage.setItem("token", API_RESPONSE.data["token"]);
      setLoggedInUser(API_RESPONSE.data["user"]);
      return API_RESPONSE;
    },
    onError: (error) => {
      return error;
    },
  });

  const {
    isLoading: isLoadingUser,
    data: currentUser,
    error: userError,
    refetch: refetchUser,
  } = useQuery(["user", loggedInUserID], fetchUserData);

  // Resend email verification code
  const resendVerificationCode = async (email: string) => {
    const response = await axios.post(`${APP_URL}/resend-verification`, {
      email,
    });
    return response;
  };

  const {
    mutateAsync: resendEmailVerificationCode,
    isLoading: isSendingVerificationCode,
  } = useMutation({
    mutationFn: resendVerificationCode,
    onSuccess: async (API_RESPONSE) => {
      return API_RESPONSE;
    },
    onError: (error) => {
      return error;
    },
  });

  // User login
  const login = async ({ email, password }: LoginUserT) => {
    const response = await axios.post(`${APP_URL}/login-user`, {
      email,
      password,
    });
    return response;
  };

  const { mutateAsync: loginUser, isLoading: isUserLogging } = useMutation({
    mutationFn: login,
    onSuccess: async (API_RESPONSE) => {
      await AsyncStorage.setItem("token", API_RESPONSE.data["token"]);
      setLoggedInUser(API_RESPONSE.data["user"]);
      return {
        data: API_RESPONSE.data,
        status: API_RESPONSE.status,
      };
    },
    onError: (error, args) => {
      setEmailTryingToAuthenticate(args.email);
      return error;
    },
  });

  //   user logout
  const logout = async () => {
    setIsLoading(true);
    await AsyncStorage.removeItem("token");
    setLoggedInUser(null); // Clear user data on logout
    setIsLoading(false);
  };

  return {
    isLoadingUser,
    currentUser,
    userError,
    refetchUser,
    verifyUserEmail,
    isEmailVerifying,
    isVerificationNotCompleted,
    registerUser,
    loginUser,
    isUserRegistering,
    isUserLogging,
    logout,
    resendEmailVerificationCode,
    isSendingVerificationCode,
  };
};

export default useUser;
