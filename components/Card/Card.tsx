import { useThemeContext } from "@/context/ThemeContext";
import { Link } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { Menu, MenuDivider, MenuItem } from "react-native-material-menu";
import Icon from "react-native-vector-icons/MaterialIcons";

const Card = ({ cardData, expanded, setExpanded, pathname }: any) => {
  const [visible, setVisible] = useState(false);
  const showMenu = () => setVisible(true);
  const hideMenu = () => setVisible(false);
  const { theme } = useThemeContext();

  return (
    <Link
      style={[styles.card, { backgroundColor: theme.colors.inputBackground }]}
      asChild
      href={{
        pathname,
        params: { customerName: cardData.name },
      }}
    >
      <Pressable>
        {cardData.sections.map((section: any, index: number) => (
          <View key={index} style={styles.row}>
            {section.leftSection && (
              <View style={styles.headerSection}>
                {section.leftSection.icon && (
                  <Icon
                    name={section.leftSection.icon}
                    size={24}
                    color={theme.colors.primary}
                  />
                )}
                {section.leftSection.title && (
                  <Text style={[styles.name, { color: theme.colors.text }]}>
                    {section.leftSection.title}
                  </Text>
                )}
              </View>
            )}

            {section.rightSection && (
              <Menu
                visible={visible}
                anchor={
                  <TouchableOpacity onPress={showMenu}>
                    {section.rightSection.icon && (
                      <Icon
                        name={section.rightSection.icon}
                        size={24}
                        color={theme.colors.primary}
                      />
                    )}
                  </TouchableOpacity>
                }
                onRequestClose={hideMenu}
              >
                <MenuItem onPress={() => alert("Edit")}>Edit</MenuItem>
                <MenuItem onPress={() => alert("Delete")}>Delete</MenuItem>
                <MenuDivider />
              </Menu>
            )}
          </View>
        ))}

        {expanded && (
          <View style={styles.expandedContent}>
            <Text style={[styles.phone, { color: theme.colors.secondaryText }]}>
              Phone: {cardData.phone}
            </Text>
          </View>
        )}

        <Icon
          onPress={() => setExpanded(!expanded)}
          name={expanded ? "expand-less" : "expand-more"}
          size={24}
          color={theme.colors.primary}
          style={styles.expandIcon}
        />
      </Pressable>
    </Link>
  );
};

const styles = StyleSheet.create({
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  headerSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
  expandIcon: {
    alignSelf: "flex-start",
  },
  expandedContent: {
    marginTop: 16,
  },
  phone: {
    fontSize: 14,
    marginBottom: 8,
  },
});

export default Card;
