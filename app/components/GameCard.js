import React from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import colors from "../config/colors";

const GameCard = ({ item, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.gameItem}>
        <Image
          source={{ uri: item.background_image }}
          style={styles.gameImage}
        />
        <View style={styles.detailsContainer}>
          <Text style={styles.gameTitle}>{item.name}</Text>
          <Text>Released: {item.released}</Text>
          <Text>Rating: {item.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  gameItem: {
    borderRadius: 15,
    backgroundColor: colors.light,
    marginBottom: 20,
    overflow: "hidden",
  },
  detailsContainer: {
    padding: 20,
  },
  gameImage: {
    width: "100%",
    height: 200,
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 7,
  },
});

export default GameCard;
