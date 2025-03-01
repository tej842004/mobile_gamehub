import React, { useState } from "react";
import { Alert, StyleSheet } from "react-native";
import * as Yup from "yup";
import { supabase } from "../lib/supabase";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";

import AppForm from "../components/AppForm";
import AppFormField from "../components/AppFormField";
import Screen from "../components/Screen";
import SubmitButton from "../components/SubmitButton";
import { useAuth } from "../context/AuthContext";
import FormImagePicker from "../components/FormImagePicker";

const validationSchema = Yup.object().shape({
  title: Yup.string().required().min(1).label("Title"),
  description: Yup.string().required().label("Description"),
  image: Yup.string().nullable().required("An image is required"),
});

function ListingEditScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const user_id = user?.id;

  const handleSubmit = async ({ title, description, image }) => {
    if (!user || !image) return;
    setLoading(true);

    const fileName = `post-${Date.now()}.jpg`;

    const base64 = await FileSystem.readAsStringAsync(image, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const arrayBuffer = decode(base64);

    const { data: storageData, error: storageError } = await supabase.storage
      .from("post-images")
      .upload(fileName, arrayBuffer, {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (storageError) {
      throw storageError;
    }

    const { data: urlData } = supabase.storage
      .from("post-images")
      .getPublicUrl(fileName);

    const image_url = urlData.publicUrl;

    const { error } = await supabase
      .from("posts")
      .insert([{ title, description, user_id, image_url }]);

    setLoading(false);

    if (error) {
      Alert.alert("Error", error.message);
      setLoading(false);
      return;
    }

    navigation.navigate("Feed");
  };

  return (
    <Screen style={styles.container}>
      <AppForm
        initialValues={{
          title: "",
          description: "",
          image: "",
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <FormImagePicker name="image" />
        <AppFormField maxLength={255} name="title" placeholder="Title" />
        <AppFormField
          maxLength={255}
          multiline
          name="description"
          numberOfLines={3}
          placeholder="Description"
        />
        <SubmitButton
          title={loading ? "Posting..." : "Post"}
          disabled={loading}
        />
      </AppForm>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  imageContainer: {
    marginLeft: 10,
    height: 100,
    width: 100,
    borderRadius: 15,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
export default ListingEditScreen;
