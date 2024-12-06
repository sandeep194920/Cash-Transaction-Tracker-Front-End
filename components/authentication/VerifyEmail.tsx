import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Toast from "react-native-toast-message";
import { useThemeContext } from "@/context/ThemeContext"; // Make sure you have this context
import { authStyles } from "./authStyles";
import { VERIFY_EMAIL_TIME } from "@/constants/Generic";
import { formatTime } from "@/utils/dateTime";
import { useAuthContext } from "@/context/AuthContext";
import useUser from "@/hooks/useUser";
import { AuthScreensPropsT } from "@/types";
import Loading from "../Loading";
import axios from "axios";
import { router } from "expo-router";
import { STATUS_CODES } from "@/constants/StatusCodes";

const EmailVerificationScreen = ({ showAuthScreen }: AuthScreensPropsT) => {
  const [code, setCode] = useState("");
  const [timer, setTimer] = useState(VERIFY_EMAIL_TIME);
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const { theme } = useThemeContext(); // Access your theme
  const { emailTryingToAuthenticate, setEmailTryingToAuthenticate } =
    useAuthContext();
  const {
    verifyUserEmail,
    isEmailVerifying,
    resendEmailVerificationCode,
    isSendingVerificationCode,
  } = useUser();

  const formattedTime = useMemo(() => {
    return formatTime(timer);
  }, [timer]);

  /* As soon as this page is shown (mounted), which is probably the first time after register/login, the timer should begin.
  Once the timer ends, the interval is cleared and, the resend button will be available.

  On component unmounting, the timer gets cleared so it doesn't stack up intervals in the background.
  */

  useEffect(() => {
    // Start the timer
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsResendEnabled(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup on unmount
    return () => {
      return clearInterval(interval);
    };
  }, [isResendEnabled]);

  const verifyEmail = async () => {
    try {
      // we set emailTryingToAuthenticate as soon as user registers in useRegister's register call
      if (!emailTryingToAuthenticate) {
        Toast.show({
          type: "error",
          text1: "Something went wrong!",
          text2: "Try again",
        });
        showAuthScreen("Register");
        return;
      }
      //this sets the token and user
      await verifyUserEmail({
        code,
        email: emailTryingToAuthenticate,
      });
      // Let's set emailTryingToAuthenticate as null as the user now logged in already at this point
      setEmailTryingToAuthenticate(null);
      Toast.show({
        type: "success",
        text1: "Thanks for verifying!",
        text2: "Logging you in!",
      });
      router.replace("/(app)/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.status === STATUS_CODES.NOT_FOUND) {
          Toast.show({
            type: "error",
            text1: "Looks like you haven't registered yet!",
            text2: error.message,
          });
          showAuthScreen("Register");
        } else {
          Toast.show({
            type: "error",
            text1: error.response?.data.message,
            text2: "Try the code again or resend it",
          });
        }
        setTimer(0);
      } else {
        // TODO: Add alerts so you (developer) get notified (May be amplitude or any other tool)
        Toast.show({
          type: "error",
          text1: "Something went wrong!",
          text2: "Please try again after some time",
        });
      }
    }
  };

  const resendCode = async () => {
    if (!emailTryingToAuthenticate) {
      Toast.show({
        type: "error",
        text1: "Something went wrong!",
        text2: "Try again",
      });
      showAuthScreen("Register");
      return;
    }
    try {
      setIsResendEnabled(false);
      setTimer(VERIFY_EMAIL_TIME);
      await resendEmailVerificationCode(emailTryingToAuthenticate);
      Toast.show({
        type: "success",
        text1: "Enter the new code sent to your email",
        text2: "Time is ticking....",
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // TODO: Technically these errors shouldn't happen where user is already verified/ not yet registered. They shouldn't see this screen at all in that case.
        // TODO: Add alerts so you (developer) get notified (May be amplitude or any other tool)
        if (error.status === STATUS_CODES.USER_VERIFIED_ALREADY) {
          Toast.show({
            type: "error",
            text1: "Your email is already verified",
          });
          showAuthScreen("Login");
        } else if (error.status === STATUS_CODES.NOT_FOUND) {
          Toast.show({
            type: "error",
            text1: "Your email is not registered yet! Please register.",
          });
          showAuthScreen("Register");
        } else {
          // TODO: Add alerts so you (developer) get notified (May be amplitude or any other tool)
          Toast.show({
            type: "error",
            text1: "Something went wrong! Please try again later!",
          });
        }
        return;
      } else {
        // TODO: Add alerts so you (developer) get notified (May be amplitude or any other tool)
        Toast.show({
          type: "error",
          text1: "Something went wrong!",
          text2: "Please try again after some time",
        });
      }
    }
  };

  if (isEmailVerifying || isSendingVerificationCode) {
    return <Loading />;
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Text style={[styles.header, { color: theme.colors.text }]}>
        Enter the 4-digit code sent to your email
      </Text>
      <TextInput
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        maxLength={4}
        placeholder="Verification Code"
        placeholderTextColor={theme.colors.secondaryText}
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.inputBackground,
            color: theme.colors.text,
            borderColor: theme.colors.border,
          },
        ]}
      />
      <TouchableOpacity
        onPress={verifyEmail}
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
      >
        <Text style={[styles.buttonText, { color: theme.colors.buttonText }]}>
          Verify Email
        </Text>
      </TouchableOpacity>
      <Text style={[styles.timerText, { color: theme.colors.secondaryText }]}>
        {isResendEnabled
          ? "You can resend the code now."
          : `Resend code in ${formattedTime} seconds`}
      </Text>
      {isResendEnabled && (
        <TouchableOpacity onPress={resendCode} style={styles.resendLink}>
          <Text style={[styles.linkText, { color: theme.colors.primary }]}>
            Resend Code
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    height: 50,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  timerText: {
    textAlign: "center",
    marginVertical: 10,
  },
  resendLink: {
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  linkText: {
    ...authStyles,
    textDecorationLine: "underline", // Underline for the link effect
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EmailVerificationScreen;
