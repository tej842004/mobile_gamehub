import React from "react";
import { View, StyleSheet } from "react-native";

import ImageInput from "./ImageInput";

const ImageInputList = ({ imageUri, onRemoveImage, onAddImage }) => {
  return (
    <View style={styles.container}>
      {imageUri && (
        <View style={styles.image}>
          <ImageInput
            imageUri={imageUri}
            onChangeImage={() => onRemoveImage(imageUri)}
          />
        </View>
      )}
      <ImageInput onChangeImage={(uri) => onAddImage(uri)} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  image: {
    marginRight: 10,
  },
});

export default ImageInputList;
