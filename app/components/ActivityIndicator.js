import React from "react";
import { View, StyleSheet } from "react-native";

import LottieView from "lottie-react-native";

const ActivityIndicator = ({ visible = false }) => {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <LottieView
        source={require("../assets/animations/loader.json")}
        autoPlay
        loop
        style={styles.animation}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  animation: {
    height: 150,
    width: 150,
  },
  container: {
    position: "absolute",
    backgroundColor: "white",
    height: "100%",
    width: "100%",
    opacity: 0.8,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
});

export default ActivityIndicator;
