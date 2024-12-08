import { Platform, StyleSheet } from "react-native";

export const commonStyles = StyleSheet.create({
  // CARD STYLES
  card: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  rowSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  flex1: {
    flex: 1,
  },

  // TEXT STYLES
  placeAtCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  // OTHER STYLES
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    marginBottom: 10,
  },

  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 20,
  },
  androidPadding: {
    ...(Platform.OS === "android" && {
      paddingHorizontal: 18,
    }),
  },
});
