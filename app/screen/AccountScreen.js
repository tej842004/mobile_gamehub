import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { supabase } from "../lib/supabase";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";

import Screen from "../components/Screen";
import ListItem from "../components/ListItem";
import colors from "../config/colors";
import Icon from "../components/Icon";
import { useAuth } from "../context/AuthContext";
import ListItemSeparator from "../components/ListItemSeparator";

const menuItems = [
  {
    title: "Create Post",
    icon: {
      name: "pencil-plus-outline",
      backgroundColor: colors.primary,
    },
    targetScreen: "Create",
  },
  {
    title: "Your Posts",
    icon: {
      name: "file-document-outline",
      backgroundColor: colors.secondary,
    },
    targetScreen: "Posts",
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

  useEffect(() => {
    fetchProfilePhoto();
  }, [fetchProfilePhoto]);

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
          image={profileImageUri}
          title={user.user_metadata?.name || "User"}
          subTitle={user.email}
          onChangeImage={uploadProfileImage}
          useImageInput
        />
      </View>
      {/* <View style={styles.container}>
        <FlatList
          data={menuItems}
          keyExtractor={(item) => item.title}
          ItemSeparatorComponent={ListItemSeparator}
          renderItem={renderMenuItem}
        />
      </View> */}
      <ListItem
        title="Log Out"
        IconComponent={<Icon name="logout" backgroundColor="#ffe66d" />}
        onPress={signOut}
      />
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
