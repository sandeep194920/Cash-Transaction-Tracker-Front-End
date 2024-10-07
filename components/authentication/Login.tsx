import React from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useThemeContext } from "@/context/ThemeContext";
import { useAuthContext } from "@/context/AuthContext";
import SocialButtons from "./SocialButtons";
import { authStyles } from "./authStyles";
import { Formik } from "formik";
import { loginValidationSchema } from "@/utils/validationSchema";
import axios from "axios";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import { CurrentAuthScreenT } from "./Authentication";

type LoginScreenPropsT = {
  showAuthScreen: (screenName: CurrentAuthScreenT) => void;
};

const LoginScreen = ({ showAuthScreen }: LoginScreenPropsT) => {
  const { theme } = useThemeContext();
  const { authenticateUser, setUnverifiedUser } = useAuthContext();
  const router = useRouter();

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        "http://192.168.29.210:5001/api/login-user",
        {
          email,
          password,
        }
      );

      if (response.status === 200) {
        Toast.show({
          type: "success",
          text1: response.data.message,
        });

        authenticateUser(true);
        router.push("/(app)/");

        return {
          success: true,
          message: response.data.message,
        };
      }

      return {
        success: false,
        message: response.data.message || "Unexpected response from server",
      };
    } catch (error: any) {
      if (error.response) {
        if (error.response.data.resendVerification) {
          setUnverifiedUser(email);
          showAuthScreen("VerifyEmail");
          return Toast.show({
            type: "error",
            text1: error.response.data.message,
          });
        }

        const message =
          error.response.data.message || "An error occurred during login";
        Toast.show({
          type: "error",
          text1: message,
        });
        return {
          success: false,
          message,
        };
      } else if (error.request) {
        return {
          success: false,
          message: "Network error. Please try again.",
        };
      } else {
        return {
          success: false,
          message: "An unknown error occurred. Please try again.",
        };
      }
    }
  };

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={loginValidationSchema}
      onSubmit={(values) => {
        // Handle the form submission
        // authenticateUser();
        login(values.email, values.password);
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
      }) => (
        <View
          style={[
            authStyles.container,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <Image
            source={require("@/assets/images/icon.png")}
            style={authStyles.logo}
          />
          <Text style={[authStyles.header, { color: theme.colors.text }]}>
            Login
          </Text>

          <TextInput
            autoCapitalize="none"
            placeholder="Email"
            placeholderTextColor={theme.colors.secondaryText}
            style={[
              authStyles.input,
              {
                backgroundColor: theme.colors.inputBackground,
                color: theme.colors.text,
                borderColor: theme.colors.border,
              },
            ]}
            onChangeText={handleChange("email")}
            onBlur={handleBlur("email")}
            value={values.email}
          />
          {touched.email && errors.email && (
            <Text style={{ color: theme.colors.error, paddingBottom: 10 }}>
              {errors.email}
            </Text>
          )}

          <TextInput
            autoCapitalize="none"
            placeholder="Password"
            placeholderTextColor={theme.colors.secondaryText}
            secureTextEntry
            style={[
              authStyles.input,
              {
                backgroundColor: theme.colors.inputBackground,
                color: theme.colors.text,
                borderColor: theme.colors.border,
              },
            ]}
            onChangeText={handleChange("password")}
            onBlur={handleBlur("password")}
            value={values.password}
          />
          {touched.password && errors.password && (
            <Text style={{ color: theme.colors.error, paddingBottom: 10 }}>
              {errors.password}
            </Text>
          )}

          <TouchableOpacity
            onPress={() => {}}
            style={authStyles.forgotPasswordContainer}
          >
            <Text
              style={[authStyles.linkText, { color: theme.colors.primary }]}
            >
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleSubmit()}
            style={[
              authStyles.button,
              { backgroundColor: theme.colors.primary },
            ]}
          >
            <Text
              style={[
                authStyles.buttonText,
                { color: theme.colors.buttonText },
              ]}
            >
              Login
            </Text>
          </TouchableOpacity>

          <SocialButtons />

          <View style={authStyles.actionContainer}>
            <Text
              style={[
                authStyles.subText,
                { color: theme.colors.secondaryText },
              ]}
            >
              New here?{" "}
            </Text>
            <TouchableOpacity onPress={() => showAuthScreen("Register")}>
              <Text
                style={[authStyles.linkText, { color: theme.colors.primary }]}
              >
                Register
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Formik>
  );
};

export default LoginScreen;
