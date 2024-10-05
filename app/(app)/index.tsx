import { View, Text, Button } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { useAuthContext } from "@/context/AuthContext";
import ListItems from "@/components/ListItem";

const Home = () => {
  const router = useRouter();
  const { authenticateUser } = useAuthContext();
  // return (
  //   <View>
  //     <Text>Stack Home</Text>
  //     <Text
  //       onPress={() => {
  //         router.push("/(app)/users");
  //       }}
  //     >
  //       Go to users page
  //     </Text>
  //     <Button
  //       title="Logout"
  //       onPress={() => {
  //         authenticateUser(false);
  //       }}
  //     />
  //   </View>
  // );

  return <ListItems />;
};

export default Home;
