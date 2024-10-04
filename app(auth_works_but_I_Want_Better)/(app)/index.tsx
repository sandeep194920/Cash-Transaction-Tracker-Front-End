import { View, Text, Button } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { useAppContext } from "@/context/AppContext";

const Home = () => {
  const router = useRouter();
  const { authenticateUser } = useAppContext();
  return (
    <View>
      <Text>Stack Home</Text>
      <Text
        onPress={() => {
          router.push("/(app)/users");
        }}
      >
        Go to users page
      </Text>
      <Button
        title="Logout"
        onPress={() => {
          authenticateUser(false);
        }}
      />
    </View>
  );
};

export default Home;
