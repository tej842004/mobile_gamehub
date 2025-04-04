import React, { useState } from "react";
import { StyleSheet, FlatList, Alert, Text, View } from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

import Screen from "../components/Screen";
import Card from "../components/Card";
import colors from "../config/colors";
import ActivityIndicator from "../components/ActivityIndicator";
import AppText from "../components/AppText";

const ListingScreen = ({ navigation }) => {
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
        {fetchData.length === 0 ? (
          <View style={styles.textContainer}>
            <AppText style={styles.text}>Nothing to show</AppText>
          </View>
        ) : (
          <FlatList
            data={fetchData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Card
                title={item.title}
                subTitle={new Date(item.created_at).toISOString().split("T")[0]}
                imageUrl={item.image_url}
                isLiked={item.isLiked}
                likeCount={item.likeCount}
                onLikedToggle={() => fetchPosts()}
                isBookmarked={item.isBookmarked}
                bookmarkCount={item.bookmarkCount}
                onBookmarkToggle={() => fetchPosts()}
                postId={item.id}
                onPress={() => navigation.navigate("ListingDetails", item)}
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
  text: {
    color: colors.medium,
  },
  textContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  screen: {
    padding: 10,
    backgroundColor: colors.light,
  },
});

export default ListingScreen;
