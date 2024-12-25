import { commonStyles } from "@/commonStyles";
import FeatureComparisonTable from "@/components/FeatureComparisonTable";
import { useThemeContext } from "@/context/ThemeContext";
import React from "react";

import * as WebBrowser from "expo-web-browser";

import { StyleSheet, View, Text, SafeAreaView, ScrollView } from "react-native";
import Pricing from "@/components/Pricing";

const CttPlus = () => {
  const { theme } = useThemeContext();

  const redirectToSite = async () => {
    await WebBrowser.openBrowserAsync("http://localhost:3000");
  };

  return (
    <SafeAreaView
      style={[
        commonStyles.flex1,
        commonStyles.androidPadding,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <ScrollView>
        {/* Heading */}
        <View style={[commonStyles.rowSection, { marginVertical: 16 }]}>
          <Text style={[styles.headerText, { color: theme.colors.text }]}>
            Cash Transaction Tracker{" "}
          </Text>
          <Text style={[styles.headerText, { color: theme.colors.primary }]}>
            Plus
          </Text>
        </View>

        {/* Description */}
        <View style={[styles.container]}>
          <Text
            style={[{ color: theme.colors.text, lineHeight: 22, fontSize: 16 }]}
          >
            The ultimate cash ledger solution for unlimited transactions and
            advanced features to grow your business.
          </Text>

          {/* Pricing */}
          <Pricing />

          {/* Features table */}
          <FeatureComparisonTable />

          {/* Website link */}
          <Text
            onPress={redirectToSite}
            style={{
              color: theme.colors.primary,
              textDecorationLine: "underline",
              fontSize: 16,
            }}
          >
            Take a look at our website for DEMO and more info
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    ...commonStyles.androidPadding,
  },
  tableContainer: {
    marginVertical: 16,
    paddingHorizontal: 6,
    margin: "auto",
  },
  table: {
    borderWidth: 1,
    borderRadius: 4,
    overflow: "hidden", // To keep rounded corners if any
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc", // Border color between rows
  },
  tableHeader: {
    backgroundColor: "#f0f0f0", // Background color for header
    borderBottomWidth: 2, // Slightly thicker border for header
  },
  tableCell: {
    flex: 1,
    padding: 10,
    textAlign: "center", // Center text horizontally
    justifyContent: "center", // Center text vertically
    fontSize: 14,
    borderRightWidth: 1,
    borderRightColor: "#ccc", // Border between cells
  },
  headerText: {
    fontWeight: "bold", // Ensures the text in header cells is bold
    fontSize: 20, // Set font size for header text
  },
});

export default CttPlus;
