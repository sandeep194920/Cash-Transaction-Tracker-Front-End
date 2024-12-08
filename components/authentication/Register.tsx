import React from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useThemeContext } from "@/context/ThemeContext";
import SocialButtons from "./SocialButtons";
import { authStyles } from "./authStyles";
import { Formik } from "formik";
import { registerValidationSchema } from "@/utils/validationSchema";
import axios from "axios";
import Toast from "react-native-toast-message";
import useUser from "@/hooks/useUser";
import Loading from "../Loading";
import { AuthScreensPropsT, RegisterUserT } from "@/types";
import { STATUS_CODES } from "@/constants/StatusCodes";
import { commonStyles } from "@/commonStyles";

const RegisterScreen = ({ showAuthScreen }: AuthScreensPropsT) => {
  const { theme } = useThemeContext();
  const { registerUser, isUserRegistering } = useUser();

  const register = async ({ name, email, password }: RegisterUserT) => {
    try {
      const { data, status } = await registerUser({ name, email, password });
      if (status === STATUS_CODES.CREATED) {
        showAuthScreen("VerifyEmail");
        Toast.show({
          type: "success",
          text1: data.message,
          text2: "Please verify the email",
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.status === STATUS_CODES.USER_EXISTS) {
          Toast.show({
            type: "error",
            text1: "You have already registered!",
            text2: "Please login",
          });
        }
        showAuthScreen("Login");
      } else {
        console.error("An unexpected error occurred:", error);
        // TODO: Add alerts so you (developer) get notified (May be amplitude or any other tool)
        Toast.show({
          type: "error",
          text1: "Something went wrong!",
          text2: "Please try again after some time",
        });
      }
    }
  };

  if (isUserRegistering) {
    return <Loading />;
  }

  return (
    <Formik
      initialValues={{ name: "", email: "", password: "" }}
      validationSchema={registerValidationSchema}
      onSubmit={(values) => {
        // Handle form submission
        register({
          name: values.name,
          email: values.email,
          password: values.password,
        });
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
            Register
          </Text>

          <TextInput
            autoCapitalize="none"
            placeholder="Name"
            placeholderTextColor={theme.colors.secondaryText}
            style={[
              authStyles.input,
              {
                backgroundColor: theme.colors.inputBackground,
                color: theme.colors.text,
                borderColor: theme.colors.border,
              },
            ]}
            onChangeText={handleChange("name")}
            onBlur={handleBlur("name")}
            value={values.name}
          />
          {touched.name && errors.name && (
            <Text style={{ color: theme.colors.error, paddingBottom: 10 }}>
              {errors.name}
            </Text>
          )}

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
              Register
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
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => showAuthScreen("Login")}>
              <Text
                style={[authStyles.linkText, { color: theme.colors.primary }]}
              >
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Formik>
  );
};

export default RegisterScreen;
