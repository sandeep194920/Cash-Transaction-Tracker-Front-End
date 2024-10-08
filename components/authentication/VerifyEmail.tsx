import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { useThemeContext } from "@/context/ThemeContext"; // Make sure you have this context
import { authStyles } from "./authStyles";
import { VERIFY_EMAIL_TIMER } from "@/constants/Timers";
import { formatTime } from "@/utils/timerFormat";
import { useAuthContext } from "@/context/AuthContext";

const EmailVerificationScreen = () => {
  const [code, setCode] = useState("");
  const [timer, setTimer] = useState(VERIFY_EMAIL_TIMER); // 2 mins timer
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const router = useRouter();
  const { theme } = useThemeContext(); // Access your theme
  const { authenticateUser, registeredUnverifiedUser } = useAuthContext();
  const { setIsLoading } = useAuthContext();

  const formattedTime = useMemo(() => {
    return formatTime(timer);
  }, [timer]);

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

    return () => clearInterval(interval); // Cleanup on unmount
  }, [isResendEnabled]);

  const verifyEmail = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://192.168.29.210:5001/api/verify-email",
        { email: registeredUnverifiedUser, verificationCode: code }
      );

      if (response.status === 200) {
        Toast.show({
          type: "success",
          text1: "Email verified successfully!",
        });

        // Redirect to main app page after success

        authenticateUser(true);
        router.push("/(app)/");
      }
    } catch (error: any) {
      // Handle errors from the server
      if (error.response) {
        // Errors returned by the server
        const message =
          error.response.data.message ||
          "Verification failed. Please try with new code";
        Toast.show({
          type: "error",
          text1: message,
        });
        return {
          success: false,
          message,
        };
      }
    } finally {
      setIsLoading(false);
    }
  };
  const resendCode = async () => {
    setTimer(VERIFY_EMAIL_TIMER);
    setIsResendEnabled(false);
    // Call your API to resend the verification code here
    try {
      await axios.post("http://192.168.29.210:5001/api/resend-verification", {
        email: registeredUnverifiedUser,
      });
      Toast.show({
        type: "success",
        text1: "Verification code resent!",
      });
    } catch (error: any) {
      const message = error.response?.data.message || "Failed to resend code.";
      Toast.show({
        type: "error",
        text1: message,
      });
    }
  };

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
