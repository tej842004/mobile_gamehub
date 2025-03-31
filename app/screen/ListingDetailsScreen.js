import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Pressable,
} from "react-native";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

import AppText from "../components/AppText";
import colors from "../config/colors";
import ListItem from "../components/ListItem";
import ActivityIndicator from "../components/ActivityIndicator";

const ListingDetailsScreen = ({ route, navigation }) => {
  const { user } = useAuth();
  const [fetchUser, setFetchUser] = useState(null);
  const [postCount, setPostCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const post = route.params;
  const created_at = new Date(post.created_at).toISOString().split("T")[0];
  const isOwner = user?.id === post.user_id;

  const fetchProfileAndCount = async () => {
    setLoading(true);

    const { data: postData, error: postError } = await supabase
      .from("posts")
      .select(
        `
        user_id,
        profiles (
          id,
          name,
          profile_picture
        )
      `
      )
      .eq("id", post.id)
      .single();

    if (postError || !postData) {
      Alert.alert("Error", "Failed to load post details: " + postError.message);
      setLoading(false);
      return;
    }

    const userData = postData.profiles;

    const { count, error: countError } = await supabase
      .from("posts")
      .select("*", { count: "exact" })
      .eq("user_id", postData.user_id);

    if (countError) {
      Alert.alert("Error", "Failed to load post count: " + countError.message);
    } else {
      setPostCount(count);
    }

    setFetchUser(userData);
    setLoading(false);
  };

  const handleDelete = async () => {
    Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const imageUrl = post.image_url;
          const filePath = imageUrl.split("/storage/v1/object/public/")[1];

          const { error: storageError } = await supabase.storage
            .from("post-images")
            .remove([filePath.split("post-images/")[1]]);

          if (storageError) {
            throw new Error("Failed to delete image: " + storageError.message);
          }

          const { error } = await supabase
            .from("posts")
            .delete()
            .eq("id", post.id)
            .eq("user_id", user.id);

          if (error) {
            Alert.alert("Error", "Failed to delete post: " + error.message);
          } else {
            Alert.alert("Success", "Post deleted successfully");
            if (route.params?.refresh) {
              route.params.refresh();
            }
            navigation.goBack();
          }
        },
      },
    ]);
  };

  useEffect(() => {
    fetchProfileAndCount();
  }, [post.id]);

  const handleProfilePress = () => {
    if (fetchUser) {
      navigation.navigate("Profile", { userId: fetchUser.id });
    }
  };

  if (loading) {
    return <ActivityIndicator visible={true} />;
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={28} color="black" />
      </TouchableOpacity>
      <Image style={styles.image} source={{ uri: post.image_url }} />
      <View style={styles.detailsContainer}>
        <View style={styles.iconContainer}>
          <AppText style={styles.title}>{post.title}</AppText>
          {isOwner && (
            <Pressable onPress={handleDelete}>
              <MaterialCommunityIcons
                name="trash-can-outline"
                color={colors.danger}
                size={25}
              />
            </Pressable>
          )}
        </View>
        <AppText style={styles.createdAt}>{created_at}</AppText>
        <AppText style={styles.body}>{post.description}</AppText>
        {fetchUser && (
          <View style={styles.userContainer}>
            <ListItem
              onPress={handleProfilePress}
              image={fetchUser.profile_picture}
              title={fetchUser.name || "Unknown User"}
              useImageInput
              subTitle={`${postCount} Post${postCount === 1 ? "" : "s"}`}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
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
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.1)",
    padding: 10,
    borderRadius: 50,
  },
});

export default ListingDetailsScreen;
