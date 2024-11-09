import { useThemeContext } from "@/context/ThemeContext";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const SettingsScreen = () => {
  const { currentTheme, theme, switchTheme } = useThemeContext();

  const themeStyles = {
    backgroundColor: theme.colors.background,
    textColor: theme.colors.text,
    radioBorderColor: theme.colors.text,
    radioFillColor: theme.colors.primary,
  };

  const handleThemeChange = (newTheme: "light" | "dark") => {
    switchTheme(newTheme);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: themeStyles.backgroundColor },
      ]}
    >
      <Text style={[styles.title, { color: themeStyles.textColor }]}>
        Select Theme
      </Text>

      {/* Light Theme Option */}
      <View style={styles.option}>
        <TouchableOpacity
          style={styles.radioContainer}
          onPress={() => handleThemeChange("light")}
        >
          <Text style={[styles.optionText, { color: themeStyles.textColor }]}>
            Light Theme
          </Text>
          <View
            style={[
              styles.radioCircle,
              { borderColor: themeStyles.radioFillColor },
              currentTheme === "light" && {
                backgroundColor: themeStyles.radioFillColor,
              },
            ]}
          />
        </TouchableOpacity>
      </View>

      {/* Dark Theme Option */}
      <View style={styles.option}>
        <TouchableOpacity
          style={styles.radioContainer}
          onPress={() => handleThemeChange("dark")}
        >
          <Text style={[styles.optionText, { color: themeStyles.textColor }]}>
            Dark Theme
          </Text>
          <View
            style={[
              styles.radioCircle,
              { borderColor: themeStyles.radioFillColor },
              currentTheme === "dark" && {
                backgroundColor: themeStyles.radioFillColor,
              },
            ]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles for the Settings screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  option: {
    marginVertical: 10,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  optionText: {
    fontSize: 16,
  },
});

export default SettingsScreen;
