import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import Icon from "react-native-vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useThemeContext } from "@/context/ThemeContext";
import { useAuthContext } from "@/context/AuthContext";
import Toast from "react-native-toast-message";
import Loading from "../Loading";
import useUser from "@/hooks/useUser";

const CustomDrawerContent = (props: any) => {
  const { theme } = useThemeContext();
  const { loggedInUser, isLoading } = useAuthContext();
  const { logout } = useUser();

  if (!loggedInUser || isLoading) return <Loading />;
  const { name, email } = loggedInUser;

  const logoutHandler = () => {
    Toast.show({
      type: "success",
      text1: "Logging out.. Hope to see you soon!",
    });
    logout();
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{
        backgroundColor: theme.colors.inputBackground,
        flex: 1,
      }}
    >
      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <Image
          source={require("@/assets/images/person.png")} // Replace with your image path
          style={[
            styles.profileImage,
            { backgroundColor: theme.colors.primary },
          ]}
        />

        <View style={styles.profileTextContainer}>
          <Text style={[styles.profileName, { color: theme.colors.text }]}>
            {name}
          </Text>
          <Text
            style={[styles.profileEmail, { color: theme.colors.secondaryText }]}
          >
            {email}
          </Text>
        </View>
      </View>

      {/* Drawer Items */}
      <DrawerItem
        label="Home"
        icon={({ color, size }) => (
          <Icon name="home" color={theme.colors.primary} size={size} />
        )}
        focused={props.state.index === 0}
        onPress={() => {}}
        activeTintColor={theme.colors.primary}
        inactiveTintColor={theme.colors.secondaryText}
        labelStyle={
          props.state.index === 0
            ? [styles.activeLabel, { color: theme.colors.text }]
            : [styles.inactiveLabel, { color: theme.colors.secondaryText }]
        }
      />

      {/* Settings with Expandable Theme Options */}
      <DrawerItem
        label="Settings"
        icon={({ color, size }) => (
          <>
            <Icon name="settings" color={theme.colors.primary} size={size} />
          </>
        )}
        focused={props.state.index === 2}
        onPress={() => router.push("/(app)/settings")}
        activeTintColor={theme.colors.primary}
        inactiveTintColor={theme.colors.secondaryText}
        labelStyle={
          props.state.index === 2
            ? [styles.activeLabel, { color: theme.colors.text! }]
            : [styles.inactiveLabel, { color: theme.colors.secondaryText! }]
        }
      />

      {/* Sign Out */}
      <DrawerItem
        label="Sign Out"
        icon={({ color, size }) => (
          <Icon name="logout" color={theme.colors.primary} size={size} />
        )}
        onPress={logoutHandler}
        inactiveTintColor={theme.colors.secondaryText}
        labelStyle={[
          styles.inactiveLabel,
          { color: theme.colors.secondaryText },
        ]}
      />
    </DrawerContentScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  activeLabel: {
    fontWeight: "bold",
  },
  inactiveLabel: {
    fontWeight: "normal",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  profileTextContainer: {
    gap: 3,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 25, // To make the image circular
    marginRight: 20,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
  },
  profileEmail: {
    fontSize: 14,
    fontWeight: "400", // Smaller font and lighter weight for the email
  },
  settingsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: "10%",
  },
  themeOptions: {
    paddingLeft: 32,
    paddingVertical: 8,
  },
  themeOption: {
    paddingVertical: 8,
  },
  themeText: {
    color: "black",
  },
});

export default CustomDrawerContent;
