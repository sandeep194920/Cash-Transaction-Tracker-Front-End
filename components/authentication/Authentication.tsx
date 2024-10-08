import React, { useState } from "react";
import LoginScreen from "./Login";
import RegisterScreen from "./Register";
import EmailVerificationScreen from "./VerifyEmail";
import Loading from "../Loading";
import { useAuthContext } from "@/context/AuthContext";

export type CurrentAuthScreenT = "Login" | "Register" | "VerifyEmail";

const Authentication = () => {
  const [currentAuthScreen, setCurrentAuthScreen] =
    useState<CurrentAuthScreenT>("Login");

  const { isLoading } = useAuthContext();

  if (isLoading) return <Loading />;

  const showAuthScreen = (screenName: CurrentAuthScreenT) => {
    setCurrentAuthScreen(screenName);
  };

  switch (currentAuthScreen) {
    case "Register":
      return <RegisterScreen showAuthScreen={showAuthScreen} />;
    case "VerifyEmail":
      return <EmailVerificationScreen />;
    case "Login":
    default:
      return <LoginScreen showAuthScreen={showAuthScreen} />;
  }
};

export default Authentication;
