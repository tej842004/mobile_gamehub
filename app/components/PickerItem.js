import React from "react";
import { Image } from "react-native";
import { Text } from "react-native";
import { View, StyleSheet, TouchableOpacity } from "react-native";

const PickerItem = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image style={styles.image} source={{ uri: item.image_background }} />
      <Text style={styles.label}>{item.name}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingVertical: 15,
    width: "33%",
  },
  label: {
    marginTop: 5,
    textAlign: "center",
  },
  image: {
    width: 85,
    height: 85,
    borderRadius: 25,
    resizeMode: "cover",
  },
});

export default PickerItem;
