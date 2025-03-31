import React, { useCallback, useState } from "react";
import { View, StyleSheet, Image, Pressable, Alert } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

import AppText from "./AppText";
import colors from "../config/colors";

const Card = ({
  title,
  subTitle,
  imageUrl,
  onPress,
  isLiked: initialIsLiked,
  likeCount: initialLikeCount,
  onLikedToggle,
  isBookmarked: initialIsBookmarked,
  bookmarkCount: initialBookmarkCount,
  onBookmarkToggle,
  postId,
}) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount || 0);
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const [bookmarkCount, setBookmarkCount] = useState(initialBookmarkCount || 0);

  const handleLikeToggle = useCallback(async () => {
    if (!user) {
      Alert.alert("Error", "Please login to like posts");
      return;
    }

    try {
      if (isLiked) {
        const { error } = await supabase
          .from("likes")
          .delete()
          .match({ user_id: user.id, post_id: postId });
        if (error) throw error;
        setIsLiked(false);
        setLikeCount((prev) => prev - 1);
      } else {
        const { error } = await supabase
          .from("likes")
          .insert({ user_id: user.id, post_id: postId });
        if (error) throw error;
        setIsLiked(true);
        setLikeCount((prev) => prev + 1);
      }
      onLikedToggle();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  }, [isLiked, user, postId]);

  const handleBookmarkToggle = useCallback(async () => {
    if (!user) {
      Alert.alert("Error", "Please login to bookmark posts");
      return;
    }

    try {
      if (isBookmarked) {
        const { error } = await supabase
          .from("bookmarks")
          .delete()
          .match({ user_id: user.id, post_id: postId });
        if (error) throw error;
        setIsBookmarked(false);
        setBookmarkCount((prev) => prev - 1);
      } else {
        const { error } = await supabase
          .from("bookmarks")
          .insert({ user_id: user.id, post_id: postId });
        if (error) throw error;
        setIsBookmarked(true);
        setBookmarkCount((prev) => prev + 1);
      }
      onBookmarkToggle();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  }, [isBookmarked, user, postId]);

  return (
    <Pressable onPress={onPress}>
      <View style={styles.card}>
        <Image style={styles.image} source={{ uri: imageUrl }} />
        <View style={styles.heartContainer}>
          <View style={styles.detailsContainer}>
            <AppText numberOfLines={1} style={styles.title}>
              {title}
            </AppText>
            <AppText style={styles.subTitle}>{subTitle}</AppText>
            <View style={styles.countsContainer}>
              <AppText style={styles.countText}>
                {likeCount} {likeCount === 1 ? "Like" : "Likes"}
              </AppText>
              <AppText style={styles.countText}>
                {bookmarkCount} {bookmarkCount === 1 ? "Bookmark" : "Bookmarks"}
              </AppText>
            </View>
          </View>
          <View style={styles.iconContainer}>
            <Pressable onPress={handleLikeToggle}>
              <MaterialCommunityIcons
                name={isLiked ? "heart" : "heart-outline"}
                size={25}
                color={isLiked ? colors.danger : colors.medium}
              />
            </Pressable>
            <Pressable onPress={handleBookmarkToggle}>
              <MaterialCommunityIcons
                name={isBookmarked ? "bookmark" : "bookmark-outline"}
                size={25}
                color={isBookmarked ? colors.primary : colors.medium}
              />
            </Pressable>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: "row",
    marginHorizontal: 10,
    gap: 8,
  },
  heartContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  card: {
    borderRadius: 15,
    backgroundColor: colors.white,
    marginBottom: 20,
    overflow: "hidden",
  },
  detailsContainer: {
    padding: 20,
    flex: 1,
  },
  image: {
    width: "100%",
    height: 200,
  },
  title: {
    marginBottom: 7,
  },
  subTitle: {
    color: colors.primary,
    fontWeight: "bold",
  },
  countsContainer: {
    marginTop: 5,
    flexDirection: "row",
    gap: 15,
  },
  countText: {
    color: colors.medium,
  },
});

export default Card;
