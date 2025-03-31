import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";

const LikesContext = createContext();

export const useLikes = () => useContext(LikesContext);

export const LikesProvider = ({ children }) => {
  const { user } = useAuth();
  const [likedPosts, setLikedPosts] = useState([]);

  useEffect(() => {
    if (user) fetchLikedPosts();
  }, [user]);

  const fetchLikedPosts = async () => {
    if (!user) return;

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
      console.error("Error fetching liked posts:", error.message);
      return;
    }

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
  };

  const toggleLike = async (postId, isLiked) => {
    if (!user) return;

    if (isLiked) {
      // Unlike the post
      await supabase
        .from("likes")
        .delete()
        .match({ user_id: user.id, post_id: postId });
    } else {
      // Like the post
      await supabase
        .from("likes")
        .insert([{ user_id: user.id, post_id: postId }]);
    }

    // Re-fetch liked posts
    fetchLikedPosts();
  };

  return (
    <LikesContext.Provider value={{ likedPosts, fetchLikedPosts, toggleLike }}>
      {children}
    </LikesContext.Provider>
  );
};
