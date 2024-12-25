import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useThemeContext } from "@/context/ThemeContext";
import { appData } from "@/data";
import CustomIcon from "./CustomIcon";
import { currency } from "@/constants/Generic";

const FeatureComparisonTable = () => {
  const { theme } = useThemeContext();

  return (
    <View style={[styles.tableContainer, { overflow: "hidden" }]}>
      <View
        style={[
          styles.table,
          {
            width: Dimensions.get("window").width * 0.9,
            borderColor: theme.colors.lightText,
            maxHeight: 500,
            overflow: "hidden",
          },
        ]}
      >
        <View style={[styles.tableRow]}>
          <Text
            style={[
              styles.tableCell,
              {
                color: theme.colors.primary,
                textAlign: "left",
                fontWeight: "bold",
                fontSize: 16,
              },
            ]}
          >
            Features
          </Text>

          <View
            style={[
              {
                alignItems: "flex-end",
              },
            ]}
          >
            <Text
              style={[
                {
                  color: theme.colors.primary,
                  fontWeight: "bold",
                  fontSize: 16,
                },
              ]}
            >
              CTT Plus
            </Text>
          </View>

          <View
            style={[
              {
                alignItems: "flex-end",
              },
            ]}
          >
            <Text
              style={[
                {
                  color: theme.colors.primary,
                  fontWeight: "bold",
                  fontSize: 16,
                },
              ]}
            >
              CTT
            </Text>
          </View>
        </View>
        {/* Table Rows */}
        <ScrollView>
          {appData.appFeatures.map((feature) => {
            return (
              <View key={feature.description} style={[styles.tableRow]}>
                <Text
                  style={[
                    styles.tableCell,
                    {
                      color: theme.colors.text,
                      textAlign: "left",
                    },
                  ]}
                >
                  {feature.description}
                </Text>

                <View
                  style={[
                    {
                      alignItems: "center",
                    },
                  ]}
                >
                  {typeof feature.ctt_plus === "string" ? (
                    <Text
                      style={[
                        {
                          color: theme.colors.text,
                          textAlign: "center",
                          fontSize: 12,
                        },
                      ]}
                    >
                      {feature.ctt_plus}
                    </Text>
                  ) : (
                    <CustomIcon
                      iconName="check-circle"
                      size={20}
                      color={theme.colors.success}
                    />
                  )}
                </View>

                <View
                  style={[
                    {
                      alignItems: "center",
                      width: 30,
                    },
                  ]}
                >
                  {typeof feature.ctt === "string" ? (
                    <Text style={[{ color: theme.colors.text, fontSize: 12 }]}>
                      {feature.ctt}
                    </Text>
                  ) : !!feature.ctt ? (
                    <CustomIcon
                      iconName="check-circle"
                      size={20}
                      color={theme.colors.success}
                    />
                  ) : (
                    <CustomIcon
                      iconName="cancel"
                      size={20}
                      color={theme.colors.error}
                    />
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

export default FeatureComparisonTable;

const styles = StyleSheet.create({
  table: {
    borderWidth: 1,
    borderRadius: 4,
    overflow: "hidden", // To keep rounded corners if any
  },
  tableContainer: {
    marginVertical: 16,
    paddingHorizontal: 6,
    margin: "auto",
  },
  tableRow: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    justifyContent: "space-between",
    gap: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc", // Border color between rows
  },
  tableHeader: {
    backgroundColor: "#f0f0f0", // Background color for header
    borderBottomWidth: 2, // Slightly thicker border for header
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
    borderRightWidth: 1,
    borderRightColor: "#ccc", // Border between cells
  },
});
