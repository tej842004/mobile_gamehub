import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { FlatList } from "react-native-gesture-handler";

import { supabase } from "../lib/supabase";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";
import { useAuth } from "../context/AuthContext";

import Screen from "../components/Screen";
import ListItem from "../components/ListItem";
import colors from "../config/colors";
import Icon from "../components/Icon";
import ListItemSeparator from "../components/ListItemSeparator";
import ActivityIndicator from "../components/ActivityIndicator";

const menuItems = [
  {
    title: "Your Posts",
    icon: { name: "file-document-outline", backgroundColor: colors.primary },
    targetScreen: "Posts",
  },
  {
    title: "Your Bookmarks",
    icon: { name: "bookmark-outline", backgroundColor: colors.secondary },
    targetScreen: "Bookmarks",
  },
  {
    title: "Your Likes",
    icon: { name: "heart-outline", backgroundColor: colors.dark_orange },
    targetScreen: "Likes",
  },
];

const AccountScreen = ({ navigation }) => {
  const { user, signOut } = useAuth();
  const [profileImageUri, setProfileImageUri] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const uploadProfileImage = useCallback(
    async (uri) => {
      if (!user || !uri) return;

      setIsLoading(true);
      try {
        const fileName = `profile-${user.id}-${Date.now()}.jpg`;
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        const arrayBuffer = decode(base64);

        const { error: storageError } = await supabase.storage
          .from("post-images")
          .upload(fileName, arrayBuffer, {
            contentType: "image/jpeg",
            upsert: true,
          });

        if (storageError)
          throw new Error(`Storage error: ${storageError.message}`);

        const { data: urlData } = supabase.storage
          .from("post-images")
          .getPublicUrl(fileName);

        if (!urlData?.publicUrl) throw new Error("Failed to get public URL");

        const { error: dbError } = await supabase
          .from("profiles")
          .update({ profile_picture: urlData.publicUrl })
          .eq("id", user.id);

        if (dbError) throw new Error(`Database error: ${dbError.message}`);

        setProfileImageUri(urlData.publicUrl);
      } catch (error) {
        Alert.alert("Error", error.message || "Failed to upload profile image");
      } finally {
        setIsLoading(false);
      }
    },
    [user]
  );

  const fetchProfilePhoto = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("profile_picture")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      if (data?.profile_picture) setProfileImageUri(data.profile_picture);
    } catch (error) {
      console.error("Failed to fetch profile:", error.message);
    }
  }, [user?.id]);

  const deleteProfileImage = useCallback(async () => {
    if (!user?.id || !profileImageUri) return;

    setIsLoading(true);
    try {
      const filePath = profileImageUri.split("/storage/v1/object/public/")[1];
      const fileName = filePath.split("post-images/")[1];

      const { error: storageError } = await supabase.storage
        .from("post-images")
        .remove([fileName]);

      if (storageError)
        throw new Error(`Failed to delete image: ${storageError.message}`);

      const { error: dbError } = await supabase
        .from("profiles")
        .update({ profile_picture: null })
        .eq("id", user.id);

      if (dbError)
        throw new Error(`Failed to update profile: ${dbError.message}`);

      setProfileImageUri(null);
      Alert.alert("Success", "Profile image deleted successfully");
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to delete profile image");
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, profileImageUri]);

  useEffect(() => {
    fetchProfilePhoto();
  }, [fetchProfilePhoto]);

  const handleImageChange = useCallback(
    (uri) => {
      if (uri) {
        uploadProfileImage(uri);
      } else {
        deleteProfileImage();
      }
    },
    [uploadProfileImage, deleteProfileImage]
  );

  const renderMenuItem = ({ item }) => (
    <ListItem
      title={item.title}
      IconComponent={
        <Icon
          name={item.icon.name}
          backgroundColor={item.icon.backgroundColor}
        />
      }
      onPress={() => navigation.navigate(item.targetScreen)}
    />
  );

  if (!user) return null;

  return (
    <Screen style={styles.screen}>
      <View style={styles.container}>
        <ListItem
          onPress={() => navigation.navigate("Profile", { userId: user.id })}
          image={profileImageUri}
          title={user.user_metadata?.name || "User"}
          subTitle={user.email}
          onChangeImage={handleImageChange}
          useImageInput
        />
      </View>
      <View style={styles.container}>
        <FlatList
          data={menuItems}
          keyExtractor={(item) => item.title}
          ItemSeparatorComponent={ListItemSeparator}
          renderItem={renderMenuItem}
        />
      </View>
      <ListItem
        title="Log Out"
        IconComponent={<Icon name="logout" backgroundColor="#ffe66d" />}
        onPress={signOut}
      />
      {isLoading && <ActivityIndicator visible={true} />}
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  screen: {
    backgroundColor: colors.light,
  },
});

export default AccountScreen;
