import React, { useState } from "react";
import { StyleSheet, FlatList, Alert, View } from "react-native";

import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { useFocusEffect } from "@react-navigation/native";

import Screen from "../components/Screen";
import Card from "../components/Card";
import ActivityIndicator from "../components/ActivityIndicator";
import colors from "../config/colors";
import AppText from "../components/AppText";

const PostScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [fetchData, setFetchData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    if (!user) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("posts")
      .select(
        `
        *,
        likes (
          id,
          user_id
        ),
        bookmarks (
          id,
          user_id
        )
      `
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      const processedData = data.map((post) => ({
        ...post,
        isLiked: post.likes.some((like) => like.user_id === user.id),
        likeCount: post.likes.length,
        isBookmarked: post.bookmarks.some(
          (bookmark) => bookmark.user_id === user.id
        ),
        bookmarkCount: post.bookmarks.length,
      }));
      setFetchData(processedData);
    }
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
        {fetchData.length === 0 && !loading ? (
          <View style={styles.emptyContainer}>
            <AppText style={styles.emptyText}>No posts yet</AppText>
          </View>
        ) : (
          <FlatList
            data={fetchData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Card
                imageUrl={item.image_url}
                title={item.title}
                subTitle={new Date(item.created_at).toISOString().split("T")[0]}
                isLiked={item.isLiked}
                likeCount={item.likeCount}
                isBookmarked={item.isBookmarked}
                bookmarkCount={item.bookmarkCount}
                postId={item.id}
                onPress={() => navigation.navigate("ListingDetails", item)}
                onLikeToggle={fetchPosts}
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

export default PostScreen;
