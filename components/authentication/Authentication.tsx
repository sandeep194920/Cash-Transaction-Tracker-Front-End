import { View, Text } from "react-native";
import React, { useState } from "react";
import LoginScreen from "./Login";
import RegisterScreen from "./Register";
import EmailVerificationScreen from "./VerifyEmail";

export type CurrentAuthScreenT = "Login" | "Register" | "VerifyEmail";

const Authentication = () => {
  const [currentAuthScreen, setCurrentAuthScreen] =
    useState<CurrentAuthScreenT>("Login");

  const showAuthScreen = (screenName: CurrentAuthScreenT) => {
    setCurrentAuthScreen(screenName);
  };

  switch (currentAuthScreen) {
    case "Register":
      return <RegisterScreen showAuthScreen={showAuthScreen} />;
    case "VerifyEmail":
      return <EmailVerificationScreen />;
    default:
      return <LoginScreen showAuthScreen={showAuthScreen} />;
  }
};

export default Authentication;
