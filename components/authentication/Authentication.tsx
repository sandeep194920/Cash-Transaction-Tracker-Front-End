import React, { useState } from "react";
import LoginScreen from "./Login";
import RegisterScreen from "./Register";
import EmailVerificationScreen from "./VerifyEmail";
import { AuthScreensT } from "@/types";

const Authentication = () => {
  const [currentAuthScreen, setCurrentAuthScreen] =
    useState<AuthScreensT>("Login");

  const showAuthScreen = (screenName: AuthScreensT) => {
    setCurrentAuthScreen(screenName);
  };

  switch (currentAuthScreen) {
    case "Register":
      return <RegisterScreen showAuthScreen={showAuthScreen} />;
    case "VerifyEmail":
      return <EmailVerificationScreen showAuthScreen={showAuthScreen} />;
    case "Login":
    default:
      return <LoginScreen showAuthScreen={showAuthScreen} />;
  }
};

export default Authentication;
