import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Screen from "./Screen";
import AppButton from "./AppButton";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { signOut, user } = useAuth();

  return (
    <Screen>
      <View style={styles.container}>
        <Text>Home</Text>
        <Text>hello, {user.user_metadata?.name}</Text>
        <AppButton title="Logout" onPress={signOut} />
      </View>
    </Screen>
  );
};
const styles = StyleSheet.create({
  container: {},
});

export default Home;
