import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import { useThemeContext } from "@/context/ThemeContext";

const SocialButtons = () => {
  const { theme } = useThemeContext();

  return (
    <>
      {/* Social Login Section */}
      <View style={styles.socialLoginContainer}>
        <TouchableOpacity
          style={[
            styles.socialButton,
            { backgroundColor: theme.colors.socialButtons.google.background },
          ]}
        >
          <FontAwesomeIcon
            name="google"
            size={20}
            color={theme.colors.socialButtons.google.color}
          />
          <Text
            style={[
              styles.socialButtonText,
              { color: theme.colors.socialButtons.google.color },
            ]}
          >
            Google Login
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.socialButton,
            { backgroundColor: theme.colors.socialButtons.fb.background },
          ]}
        >
          <FontAwesomeIcon
            name="facebook"
            size={20}
            color={theme.colors.socialButtons.google.color}
          />
          <Text
            style={[
              styles.socialButtonText,
              { color: theme.colors.socialButtons.google.color },
            ]}
          >
            Facebook Login
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default SocialButtons;

const styles = StyleSheet.create({
  socialLoginContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    flex: 1,
    marginHorizontal: 5,
  },
  socialButtonText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "400",
  },
});
