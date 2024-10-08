import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

const AuthContext = createContext({
  isLoggedIn: false,
  authenticateUser: (state?: boolean) => {},
  registeredUnverifiedUser: "",
  setUnverifiedUser: (email: string) => {},
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
