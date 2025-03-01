import React from "react";
import { View, StyleSheet, Image, TouchableHighlight } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AppText from "./AppText";
import colors from "../config/colors";
import ImageInput from "../components/ImageInput";

const ListItem = ({
  title,
  subTitle,
  image,
  onChangeImage,
  IconComponent,
  onPress,
  useImageInput = false,
}) => {
  return (
    <TouchableHighlight underlayColor={colors.light} onPress={onPress}>
      <View style={styles.container}>
        {IconComponent}
        {useImageInput && (
          <ImageInput
            imageUri={image}
            onChangeImage={onChangeImage}
            style={styles.image}
            iconSize={30}
          />
        )}
        <View style={styles.detailsContainer}>
          <AppText style={styles.title} numberOfLines={1}>
            {title}
          </AppText>
          {subTitle && (
            <AppText style={styles.subTitle} numberOfLines={2}>
              {subTitle}
            </AppText>
          )}
        </View>
        <MaterialCommunityIcons
          name="chevron-right"
          size={25}
          color={colors.medium}
        />
      </View>
    </TouchableHighlight>
  );
};
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    padding: 15,
    backgroundColor: colors.white,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 10,
  },
  title: {
    fontWeight: "500",
  },
  subTitle: {
    color: colors.medium,
  },
});

export default ListItem;
