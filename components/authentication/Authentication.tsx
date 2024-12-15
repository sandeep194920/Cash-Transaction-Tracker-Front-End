import React, { useState } from "react";
import LoginScreen from "./Login";
import RegisterScreen from "./Register";
import EmailVerificationScreen from "./EmailVerification";
import { AuthScreenStateT, ShowAuthScreenT } from "@/types";

const Authentication = () => {
  const [authScreen, setAuthScreen] = useState<AuthScreenStateT>({
    currentAuthScreen: "Login",
    previousAuthScreen: null,
  });

  const showAuthScreen = ({
    screenName,
    previousScreen = "Login",
  }: ShowAuthScreenT) => {
    setAuthScreen({
      currentAuthScreen: screenName,
      previousAuthScreen: previousScreen,
    });
  };

  switch (authScreen.currentAuthScreen) {
    case "Register":
      return <RegisterScreen showAuthScreen={showAuthScreen} />;
    case "VerifyEmail":
      return (
        <EmailVerificationScreen
          showAuthScreen={showAuthScreen}
          authScreen={authScreen}
        />
      );
    case "Login":
    default:
      return <LoginScreen showAuthScreen={showAuthScreen} />;
  }
};

export default Authentication;
