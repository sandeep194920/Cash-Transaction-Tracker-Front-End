import React from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useThemeContext } from "@/context/ThemeContext";
import SocialButtons from "./SocialButtons";
import { authStyles } from "./authStyles";
import { Formik } from "formik";
import { registerValidationSchema } from "@/utils/validationSchema";

type RegisterScreenPropsT = {
  showLoginScreen: () => void;
};

const RegisterScreen = ({ showLoginScreen }: RegisterScreenPropsT) => {
  const { theme } = useThemeContext();

  return (
    <Formik
      initialValues={{ name: "", email: "", password: "" }}
      validationSchema={registerValidationSchema}
      onSubmit={(values) => {
        // Handle form submission
        console.log("User Registered", values);
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
