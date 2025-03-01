import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import colors from "../config/colors";
import AppText from "./AppText";

const AppButton = ({ title, onPress, color = "primary", disable = false }) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: disable ? colors.medium : colors[color] },
      ]}
      onPress={onPress}
      disabled={disable}
    >
      <AppText style={styles.text}>{title}</AppText>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    width: "100%",
    marginVertical: 10,
  },
  text: {
    color: colors.white,
    fontSize: 18,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
});

export default AppButton;
