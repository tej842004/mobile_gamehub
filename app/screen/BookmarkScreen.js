import React, { useState } from "react";
import { StyleSheet, FlatList, Alert, View } from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

import AppText from "../components/AppText";
import Screen from "../components/Screen";
import Card from "../components/Card";
import colors from "../config/colors";
import ActivityIndicator from "../components/ActivityIndicator";

const BookmarksScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarkedPosts = async () => {
    if (!user) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("bookmarks")
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
      const processedData = data.map((bookmark) => {
        const post = bookmark.posts;
        return {
          ...post,
          isLiked: post.likes.some((like) => like.user_id === user.id),
          likeCount: post.likes.length,
          isBookmarked: true,
          bookmarkCount: post.bookmarks.length,
        };
      });
      setBookmarkedPosts(processedData);
    }
    setLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchBookmarkedPosts();
    }, [user])
  );

  return (
    <>
      <ActivityIndicator visible={loading} />
      <Screen style={styles.screen}>
        {bookmarkedPosts.length === 0 && !loading ? (
          <View style={styles.emptyContainer}>
            <AppText style={styles.emptyText}>No bookmarked posts yet</AppText>
          </View>
        ) : (
          <FlatList
            data={bookmarkedPosts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Card
                title={item.title}
                subTitle={new Date(item.created_at).toISOString().split("T")[0]}
                imageUrl={item.image_url}
                isLiked={item.isLiked}
                likeCount={item.likeCount}
                isBookmarked={item.isBookmarked}
                bookmarkCount={item.bookmarkCount}
                postId={item.id}
                onPress={() => navigation.navigate("ListingDetails", item)}
                onLikeToggle={fetchBookmarkedPosts}
                onBookmarkToggle={fetchBookmarkedPosts}
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

export default BookmarksScreen;
