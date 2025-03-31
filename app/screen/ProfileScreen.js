import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";

import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

import AppText from "../components/AppText";
import colors from "../config/colors";
import Card from "../components/Card";
import ActivityIndicator from "../components/ActivityIndicator";
import { Ionicons } from "@expo/vector-icons";

const ProfileScreen = ({ route, navigation }) => {
  const { user: currentUser } = useAuth();
  const { userId } = route.params;
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [postCount, setPostCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");

  const fetchProfileData = async () => {
    setLoading(true);

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("id, name, profile_picture")
      .eq("id", userId)
      .single();

    if (profileError || !profileData) {
      Alert.alert("Error", "Failed to load profile: " + profileError.message);
      setLoading(false);
      return;
    }

    const { data: postData, error: postError } = await supabase
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
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (postError) {
      Alert.alert("Error", "Failed to load posts: " + postError.message);
    } else {
      const processedPosts = postData.map((post) => ({
        ...post,
        isLiked: post.likes.some((like) => like.user_id === currentUser?.id),
        likeCount: post.likes.length,
        isBookmarked: post.bookmarks.some(
          (bookmark) => bookmark.user_id === currentUser?.id
        ),
        bookmarkCount: post.bookmarks.length,
      }));
      setPosts(processedPosts);
      setPostCount(processedPosts.length);
    }

    const { data: likedData, error: likedError } = await supabase
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
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (likedError) {
      Alert.alert("Error", "Failed to load liked posts: " + likedError.message);
    } else {
      const processedLikedPosts = likedData.map((like) => {
        const post = like.posts;
        return {
          ...post,
          isLiked: true,
          likeCount: post.likes.length,
          isBookmarked: post.bookmarks.some(
            (bookmark) => bookmark.user_id === currentUser?.id
          ),
          bookmarkCount: post.bookmarks.length,
        };
      });
      setLikedPosts(processedLikedPosts);
    }

    setProfile(profileData);
    setLoading(false);
  };

  useEffect(() => {
    fetchProfileData();
  }, [userId]);

  return (
    <>
      <ActivityIndicator visible={loading} />
      <ScrollView style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <View style={styles.header}>
          <Image
            style={styles.profilePicture}
            source={{
              uri:
                profile?.profile_picture || "https://via.placeholder.com/150",
            }}
          />
          <AppText style={styles.name}>
            {profile?.name || "Unknown User"}
          </AppText>
          <AppText style={styles.postCount}>
            {postCount} Post{postCount === 1 ? "" : "s"}
          </AppText>
        </View>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "posts" && styles.activeTab]}
            onPress={() => setActiveTab("posts")}
          >
            <AppText
              style={[
                styles.tabText,
                activeTab === "posts" && styles.activeTabText,
              ]}
            >
              Posts
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "likes" && styles.activeTab]}
            onPress={() => setActiveTab("likes")}
          >
            <AppText
              style={[
                styles.tabText,
                activeTab === "likes" && styles.activeTabText,
              ]}
            >
              Likes
            </AppText>
          </TouchableOpacity>
        </View>
        <View style={styles.postContainer}>
          <FlatList
            data={activeTab === "posts" ? posts : likedPosts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Card
                title={item.title}
                subTitle={new Date(item.created_at).toISOString().split("T")[0]}
                imageUrl={item.image_url}
                isLiked={item.isLiked}
                likeCount={item.likeCount}
                onLikedToggle={() => fetchProfileData()}
                isBookmarked={item.isBookmarked}
                bookmarkCount={item.bookmarkCount}
                onBookmarkToggle={() => fetchProfileData()}
                postId={item.id}
                onPress={() => navigation.navigate("ListingDetails", item)}
              />
            )}
            ListEmptyComponent={
              <AppText style={styles.emptyText}>
                No {activeTab === "posts" ? "posts" : "liked posts"} yet
              </AppText>
            }
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    padding: 15,
  },
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  header: {
    alignItems: "center",
    padding: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
  },
  postCount: {
    fontSize: 16,
    color: colors.medium,
    marginTop: 5,
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.light,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: colors.medium,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    color: colors.medium,
    fontSize: 16,
    marginTop: 20,
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

export default ProfileScreen;
