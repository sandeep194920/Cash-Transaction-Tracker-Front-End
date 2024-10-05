import React from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useThemeContext } from "@/context/ThemeContext";
import { useAuthContext } from "@/context/AuthContext";
import SocialButtons from "./SocialButtons";
import { authStyles } from "./authStyles";
import { Formik } from "formik";
import { loginValidationSchema } from "@/utils/validationSchema";

type LoginScreenPropsT = {
  showRegisterScreen: () => void;
};

const LoginScreen = ({ showRegisterScreen }: LoginScreenPropsT) => {
  const { theme } = useThemeContext();
  const { authenticateUser } = useAuthContext();

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={loginValidationSchema}
      onSubmit={(values) => {
        // Handle the form submission
        // authenticateUser();
        console.log("Login form submitted");
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
            <TouchableOpacity onPress={showRegisterScreen}>
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
