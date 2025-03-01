import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Alert } from "react-native";
import { supabase } from "../lib/supabase";

import Screen from "../components/Screen";
import Card from "../components/Card";
import { useAuth } from "../context/AuthContext";
import ListItemSeparator from "../components/ListItemSeparator";
import ActivityIndicator from "../components/ActivityIndicator";
import colors from "../config/colors";

const PostScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [fetchData, setFetchData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    if (!user) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("posts")
      .select()
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      Alert.alert("Error", error.message);
      setLoading(false);
      return;
    }

    setFetchData(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, [user]);

  return (
    <>
      <ActivityIndicator visible={loading} />
      <Screen style={styles.screen}>
        <FlatList
          data={fetchData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Card
              imageUrl={item.image_url}
              title={item.title}
              subTitle={new Date(item.created_at).toISOString().split("T")[0]}
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

export default PostScreen;
