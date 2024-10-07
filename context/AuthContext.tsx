import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext({
  isLoggedIn: false,
  authenticateUser: (state?: boolean) => {},
  registeredUnverifiedUser: "",
  setUnverifiedUser: (email: string) => {},
});

type AuthProviderT = {
  children: React.ReactNode;
};

const AuthProvider = ({ children }: AuthProviderT) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [registeredUnverifiedUser, setRegisteredUnverifiedUser] = useState("");

  const authenticateUser = (loginState = true) => {
    setIsLoggedIn(loginState);
  };

  const setUnverifiedUser = (email: string) => {
    setRegisteredUnverifiedUser(email);
  };

  const appValues = {
    isLoggedIn,
    authenticateUser,
    registeredUnverifiedUser,
    setUnverifiedUser,
  };

  return (
    <AuthContext.Provider value={appValues}>{children}</AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
