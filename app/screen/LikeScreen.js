import React, { useState } from "react";
import { StyleSheet, FlatList, Alert, View, Text } from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

import Screen from "../components/Screen";
import Card from "../components/Card";
import colors from "../config/colors";
import ActivityIndicator from "../components/ActivityIndicator";

const LikesScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [likedPosts, setLikedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLikedPosts = async () => {
    if (!user) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("likes")
      .select(
        `
        post_id,
        posts (
          *,
          likes (
            id,
            user_id
          ),
          bookmarks (
            id,
            user_id
          )
        )
      `
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      const processedData = data.map((like) => {
        const post = like.posts;
        return {
          ...post,
          isLiked: true,
          likeCount: post.likes.length,
          isBookmarked: post.bookmarks.some(
            (bookmark) => bookmark.user_id === user.id
          ),
          bookmarkCount: post.bookmarks.length,
        };
      });
      setLikedPosts(processedData);
    }
    setLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchLikedPosts();
    }, [user])
  );

  return (
    <>
      <ActivityIndicator visible={loading} />
      <Screen style={styles.screen}>
        {likedPosts.length === 0 && !loading ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No liked posts yet</Text>
          </View>
        ) : (
          <FlatList
            data={likedPosts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Card
                title={item.title}
                subTitle={new Date(item.created_at).toISOString().split("T")[0]}
                imageUrl={item.image_url}
                isLiked={item.isLiked}
                likeCount={item.likeCount}
                onLikedToggle={() => fetchLikedPosts()}
                isBookmarked={item.isBookmarked}
                bookmarkCount={item.bookmarkCount}
                postId={item.id}
                onPress={() => navigation.navigate("ListingDetails", item)}
                onLikeToggle={fetchLikedPosts}
                onBookmarkToggle={fetchLikedPosts}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </Screen>
    </>
  );
};

const styles = StyleSheet.create({
  screen: {
    padding: 10,
    backgroundColor: colors.light,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: colors.medium,
    fontSize: 18,
  },
});

export default LikesScreen;
