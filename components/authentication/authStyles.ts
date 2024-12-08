import { Platform, StyleSheet } from "react-native";

export const authStyles = StyleSheet.create({
  // Common styles for both Login and Register screens
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: "center",
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
  },
  input: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  linkText: {
    fontSize: 14,
    fontWeight: "semibold",
  },
  subText: {
    fontSize: 16,
  },
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginBottom: 20,
  },
  button: {
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
});
