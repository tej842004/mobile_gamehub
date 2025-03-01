import React, { useState } from "react";
import { StyleSheet, FlatList, Alert } from "react-native";
import { supabase } from "../lib/supabase";
import { useFocusEffect } from "@react-navigation/native";

import Screen from "../components/Screen";
import Card from "../components/Card";
import colors from "../config/colors";
import { useAuth } from "../context/AuthContext";
import ActivityIndicator from "../components/ActivityIndicator";

const ListingScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [fetchData, setFetchData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    if (!user) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("posts")
      .select()
      .order("created_at", { ascending: false });

    if (error) {
      Alert.alert("Error", error.message);
      setLoading(false);
      return;
    }

    setFetchData(data);
    setLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchPosts();
    }, [user])
  );
  return (
    <>
      <ActivityIndicator visible={loading} />
      <Screen style={styles.screen}>
        <FlatList
          data={fetchData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Card
              title={item.title}
              subTitle={new Date(item.created_at).toISOString().split("T")[0]}
              imageUrl={item.image_url}
              onPress={() => navigation.navigate("ListingDetails", item)}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      </Screen>
    </>
  );
};
const styles = StyleSheet.create({
  screen: {
    padding: 10,
    backgroundColor: colors.light,
  },
});

export default ListingScreen;
