import { commonStyles } from "@/commonStyles";
import CustomIcon from "@/components/CustomIcon";
import { useAppContext } from "@/context/AppContext";
import { useThemeContext } from "@/context/ThemeContext";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";

const SettingsScreen = () => {
  const { currentTheme, theme, switchTheme } = useThemeContext();
  const [isPercentageEdit, setIsPercentageEdit] = useState(false);
  const { taxPercentage, setTaxPercentage } = useAppContext();

  const themeStyles = {
    backgroundColor: theme.colors.background,
    textColor: theme.colors.text,
    radioBorderColor: theme.colors.text,
    radioFillColor: theme.colors.primary,
  };

  const handleThemeChange = (newTheme: "light" | "dark") => {
    switchTheme(newTheme);
  };

  const taxContainer = (
    <View style={commonStyles.rowSection}>
      <View style={commonStyles.rowSection}>
        {isPercentageEdit ? (
          <TextInput
            style={[
              styles.input,

              {
                color: themeStyles.textColor,
                borderColor: themeStyles.textColor,
              },
            ]}
            value={taxPercentage.toString()}
            keyboardType="numeric"
            onChangeText={(text) => setTaxPercentage(Number(text))}
            autoFocus
          />
        ) : (
          <Text style={{ color: themeStyles.textColor }}>{taxPercentage}</Text>
        )}
        <CustomIcon
          iconName="percent"
          size={16}
          color={theme.colors.primary}
          marginLeft={0.01}
          marginRight={15}
        />
      </View>

      {isPercentageEdit ? (
        <CustomIcon
          iconName="check"
          size={24}
          color={theme.colors.success}
          onPress={() => {
            setIsPercentageEdit((prev) => !prev);
          }}
        />
      ) : (
        <CustomIcon
          iconName="edit"
          size={24}
          color={theme.colors.primary}
          onPress={() => {
            setIsPercentageEdit((prev) => !prev);
          }}
        />
      )}
    </View>
  );

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
          style={commonStyles.cardRow}
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
          style={commonStyles.cardRow}
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

      {/* Divider Line */}
      <View style={styles.divider} />

      <Text style={[styles.title, { color: themeStyles.textColor }]}>
        Select Tax Percentage
      </Text>

      {/* Light Theme Option */}

      <View style={[commonStyles.cardRow, styles.option]}>
        <Text style={[styles.optionText, { color: themeStyles.textColor }]}>
          Current Tax
        </Text>

        {taxContainer}
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
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 20,
  },
  input: {
    borderBottomWidth: 1,
    fontSize: 16,
    width: 40,
    textAlign: "center",
  },
});

export default SettingsScreen;
