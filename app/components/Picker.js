import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Modal,
  Button,
  FlatList,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../config/colors";
import PickerItem from "./PickerItem";

const Picker = ({ icon, items, placeholder, onSelectItem, selectedItem }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
        <View style={styles.container}>
          {icon && (
            <MaterialCommunityIcons
              name={icon}
              size={20}
              color={colors.medium}
              style={styles.icon}
            />
          )}
          <Text style={styles.text}>
            {selectedItem ? selectedItem.name : placeholder}
          </Text>
          <MaterialCommunityIcons
            name="chevron-down"
            size={20}
            color={colors.medium}
          />
        </View>
      </TouchableWithoutFeedback>
      <Modal visible={modalVisible} animationType="slide">
        <Button title="close" onPress={() => setModalVisible(false)} />
        <FlatList
          data={items}
          numColumns={3}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PickerItem
              item={item}
              onPress={() => {
                setModalVisible(false);
                onSelectItem(item);
              }}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      </Modal>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.light,
    borderRadius: 25,
    flexDirection: "row",
    width: "100%",
    padding: 15,
    marginVertical: 10,
  },
  icon: {
    marginRight: 10,
  },
  text: {
    flex: 1,
  },
});

export default Picker;
