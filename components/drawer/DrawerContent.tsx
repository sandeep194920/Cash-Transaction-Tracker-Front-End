import React from "react";
import { StyleSheet } from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useColorScheme } from "react-native";
import { themes } from "@/constants/Colors"; // Assuming your themes are defined here
import { useRouter } from "expo-router";
import { useThemeContext } from "@/context/ThemeContext";

const CustomDrawerContent = (props: any) => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const { theme } = useThemeContext();
  const router = useRouter();

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{
        backgroundColor: theme.colors.inputBackground,
        flex: 1,
      }}
    >
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
      <DrawerItem
        label="Profile"
        icon={({ color, size }) => (
          <Icon name="person" color={theme.colors.primary} size={size} />
        )}
        focused={props.state.index === 1}
        onPress={() => router.push("/(app)/user_profile")}
        activeTintColor={theme.colors.primary}
        inactiveTintColor={theme.colors.secondaryText}
        labelStyle={
          props.state.index === 1
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
        onPress={() => {}}
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
