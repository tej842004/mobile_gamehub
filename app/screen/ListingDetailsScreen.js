import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, ScrollView } from "react-native";

import AppText from "../components/AppText";
import colors from "../config/colors";
import { useAuth } from "../context/AuthContext";
import ListItem from "../components/ListItem";
import { supabase } from "../lib/supabase";

const ListingDetailsScreen = ({ route }) => {
  const [fetchUser, setFetchUser] = useState("");
  const [count, setCount] = useState(0);
  const { user } = useAuth();
  const post = route.params;
  const created_at = new Date(post.created_at).toISOString().split("T")[0];

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("user_id")
        .eq("id", post.id)
        .single();

      if (error || !data) {
        console.error("Error fetching post:", error);
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select()
        .eq("id", data.user_id)
        .single();

      if (userError || !userData) {
        console.error("Error fetching user profile:", userError);
        return;
      }

      setFetchUser(userData);

      const { count, error: countError } = await supabase
        .from("posts")
        .select("*", { count: "exact" })
        .eq("user_id", data.user_id);

      if (countError) {
        console.error("Error fetching post count:", countError);
        return;
      }

      setCount(count);
    } catch (err) {
      console.error("Error in fetchProfile:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Image style={styles.image} source={{ uri: post.image_url }} />
      <View style={styles.detailsContainer}>
        <AppText style={styles.title}>{post.title}</AppText>
        <AppText style={styles.createdAt}>{created_at}</AppText>
        <AppText style={styles.body}>{post.description}</AppText>
        <View style={styles.userContainer}>
          <ListItem
            image={fetchUser.profile_picture}
            title={fetchUser.name}
            useImageInput
            subTitle={`${count} Posts`}
          />
        </View>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  detailsContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    flex: 1,
  },
  image: {
    width: "100%",
    height: 300,
  },
  createdAt: {
    color: colors.secondary,
    fontSize: 14,
    marginVertical: 10,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  userContainer: {
    marginVertical: 50,
    width: "100%",
  },
});

export default ListingDetailsScreen;
