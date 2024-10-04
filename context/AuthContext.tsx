import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext({
  isLoggedIn: false,
  authenticateUser: (state?: boolean) => {},
});

type AuthProviderT = {
  children: React.ReactNode;
};

const AuthProvider = ({ children }: AuthProviderT) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const authenticateUser = (loginState = true) => {
    console.log("Setting user to logged In state", loginState);
    setIsLoggedIn(loginState);
  };

  const appValues = {
    isLoggedIn,
    authenticateUser,
  };

  return (
    <AuthContext.Provider value={appValues}>{children}</AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
