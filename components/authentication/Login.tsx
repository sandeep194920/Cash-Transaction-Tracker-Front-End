import React from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useThemeContext } from "@/context/ThemeContext";
import SocialButtons from "./SocialButtons";
import { authStyles } from "./authStyles";
import { Formik } from "formik";
import { loginValidationSchema } from "@/utils/validationSchema";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import { AuthScreensPropsT, LoginUserT } from "@/types";
import useUser from "@/hooks/useUser";
import Loading from "../Loading";
import axios from "axios";
import { STATUS_CODES } from "@/constants/StatusCodes";
import { commonStyles } from "@/commonStyles";

const LoginScreen = ({ showAuthScreen }: AuthScreensPropsT) => {
  const { theme } = useThemeContext();
  const { loginUser, isUserLogging } = useUser();

  const login = async ({ email, password }: LoginUserT) => {
    try {
      const { data, status } = await loginUser({ email, password });
      console.log("The status is", status);
      if (status === STATUS_CODES.SUCCESS) {
        // Take user to the app
        router.replace("/(app)/");
        Toast.show({
          type: "success",
          text1: "Welcome back!",
          text2: data.message,
        });
      }
      return;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // user doesn't exist
        if (error.status === STATUS_CODES.NOT_FOUND) {
          Toast.show({
            type: "error",
            text1: error.response?.data.message,
          });
          showAuthScreen({ screenName: "Register" });
        } else if (error.status === STATUS_CODES.INVALID_CREDENTIALS) {
          Toast.show({
            type: "error",
            text1: error.response?.data.message,
            text2: "Please try again!",
          });
          // OPTIONAL : this clears the form by setting it to Login screen again
          // showAuthScreen("Login");
        } else if (error.status === STATUS_CODES.EMAIL_NOT_VERIFIED) {
          Toast.show({
            type: "error",
            text1: error.response?.data.message,
            text2: "Enter the code sent to your email!",
          });
          showAuthScreen({
            screenName: "VerifyEmail",
            previousScreen: "Login",
          });
        }
        return;
      } else {
        console.log("Coming here for some reason");
        // TODO: Add alerts so you (developer) get notified (May be amplitude or any other tool)
        Toast.show({
          type: "error",
          text1: "Something went wrong",
          text2: "Please try again!",
        });
      }
    }
  };

  if (isUserLogging) {
    return <Loading />;
  }

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={loginValidationSchema}
      onSubmit={(values) => {
        // Handle the form submission
        login({ email: values.email, password: values.password });
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
            commonStyles.androidPadding,
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

          {/* <SocialButtons /> */}

          <View style={authStyles.actionContainer}>
            <Text
              style={[
                authStyles.subText,
                { color: theme.colors.secondaryText },
              ]}
            >
              New here?{" "}
            </Text>
            <TouchableOpacity
              onPress={() => showAuthScreen({ screenName: "Register" })}
            >
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
