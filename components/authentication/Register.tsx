import React from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useThemeContext } from "@/context/ThemeContext";
import SocialButtons from "./SocialButtons";
import { authStyles } from "./authStyles";
import { Formik } from "formik";
import { registerValidationSchema } from "@/utils/validationSchema";
import axios from "axios";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import { useAuthContext } from "@/context/AuthContext";

type RegisterScreenPropsT = {
  showLoginScreen: () => void;
};

type RegisterT = {
  name: string;
  email: string;
  password: string;
};

const RegisterScreen = ({ showLoginScreen }: RegisterScreenPropsT) => {
  const { theme } = useThemeContext();
  const router = useRouter();
  const { authenticateUser } = useAuthContext();

  const register = async ({ name, email, password }: RegisterT) => {
    console.log("Sandeep");
    try {
      const response = await axios.post(
        "http://192.168.29.210:5001/register-user",
        {
          name,
          email,
          password,
        }
      );

      // Handle success based on the status code or response data
      if (response.status === 201) {
        console.log("User registered successfully:", response.data.message);
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

      // Handle any other possible success status (if applicable)
      return {
        success: false,
        message: response.data.message || "Unexpected response from server",
      };
    } catch (error: any) {
      // Handle errors from the server
      if (error.response) {
        // Errors returned by the server
        const message =
          error.response.data.message ||
          "An error occurred during registration";
        console.log(message);
        Toast.show({
          type: "error",
          text1: message,
        });
        return {
          success: false,
          message,
        };
      } else if (error.request) {
        // Network errors or no response from the server
        console.log("Network error:", error.message);
        return {
          success: false,
          message: "Network error. Please try again.",
        };
      } else {
        // Something else went wrong
        console.log("Error:", error.message);
        return {
          success: false,
          message: "An unknown error occurred. Please try again.",
        };
      }
    }
  };

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

          <SocialButtons />

          <View style={authStyles.actionContainer}>
            <Text
              style={[
                authStyles.subText,
                { color: theme.colors.secondaryText },
              ]}
            >
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={showLoginScreen}>
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
