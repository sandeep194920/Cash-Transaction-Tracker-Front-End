import { UserDataT } from "@/types";
import { fetchUserData } from "@/utils/fetchUser";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type CreateContextT = {
  isLoggedIn: boolean;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  emailTryingToAuthenticate: string | null;
  setEmailTryingToAuthenticate: Dispatch<SetStateAction<string | null>>;
  loggedInUser: UserDataT | null;
  setLoggedInUser: Dispatch<SetStateAction<UserDataT | null>>;
};

const AuthContext = createContext<CreateContextT>({
  isLoggedIn: false,
  emailTryingToAuthenticate: null,
  setEmailTryingToAuthenticate: (() => {}) as Dispatch<
    SetStateAction<string | null>
  >,
  isLoading: false,
  setIsLoading: (() => {}) as Dispatch<SetStateAction<boolean>>,
  loggedInUser: null,
  setLoggedInUser: (() => {}) as Dispatch<SetStateAction<UserDataT | null>>,
});

type AuthProviderT = {
  children: React.ReactNode;
};

const AuthProvider = ({ children }: AuthProviderT) => {
  const [emailTryingToAuthenticate, setEmailTryingToAuthenticate] = useState<
    null | string
  >("");
  const [loggedInUser, setLoggedInUser] = useState<UserDataT | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isLoggedIn = useMemo(() => {
    return !!loggedInUser;
  }, [loggedInUser]);

  useEffect(() => {
    setIsLoading(true);
    const initializeAuth = async () => {
      try {
        const userData = await fetchUserData();
        if (!userData) {
          setLoggedInUser(null);
        } else {
          const { _id, name, email, userTotal } = userData;
          setLoggedInUser({
            _id,
            name,
            email,
            userTotal,
          });
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        setLoggedInUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const appValues = useMemo(() => {
    return {
      isLoggedIn,
      emailTryingToAuthenticate,
      setEmailTryingToAuthenticate,
      loggedInUser,
      setLoggedInUser,
      isLoading,
      setIsLoading,
    };
  }, [
    isLoggedIn,
    emailTryingToAuthenticate,
    setEmailTryingToAuthenticate,
    loggedInUser,
    setLoggedInUser,
    isLoading,
    setIsLoading,
  ]);

  return (
    <AuthContext.Provider value={appValues}>{children}</AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
