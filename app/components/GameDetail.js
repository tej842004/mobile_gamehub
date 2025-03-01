import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { WebView } from "react-native-webview";

import Screen from "./Screen";

const API_KEY = "c47130622d90458cba607aecc8ef2756";
const BASE_URL = `https://api.rawg.io/api`;

const GameDetail = ({ route, navigation }) => {
  const { gameId } = route.params;
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGameDetails();
  }, []);

  const fetchGameDetails = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/games/${gameId}?key=${API_KEY}`
      );
      setGame(response.data);
    } catch (error) {
      setError("Failed to load game details.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#007AFF"
        style={{ flex: 1, justifyContent: "center" }}
      />
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchGameDetails} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Screen>
      <ScrollView style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>

        <Image source={{ uri: game.background_image }} style={styles.image} />

        <Text style={styles.title}>{game.name}</Text>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>⭐ {game.rating} / 5</Text>
          <Text style={styles.infoText}>📅 {game.released}</Text>
        </View>

        <Text style={styles.sectionTitle}>Platforms</Text>
        <View style={styles.platformsContainer}>
          {game.platforms.map(({ platform }) => (
            <Text key={platform.id} style={styles.platformText}>
              {platform.name}
            </Text>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Genres</Text>
        <View style={styles.genresContainer}>
          {game.genres.map((genre) => (
            <Text key={genre.id} style={styles.genreText}>
              {genre.name}
            </Text>
          ))}
        </View>

        <Text style={styles.sectionTitle}>About the Game</Text>
        <Text style={styles.description}>{game.description_raw}</Text>

        {game.clip && (
          <>
            <Text style={styles.sectionTitle}>Game Trailer</Text>
            <WebView
              source={{ uri: game.clip.clip }}
              style={styles.video}
              allowsFullscreenVideo
            />
          </>
        )}
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
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
  image: {
    width: "100%",
    height: 250,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
    marginTop: 15,
    marginBottom: 5,
  },
  platformsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  platformText: {
    fontSize: 14,
    color: "#666",
    marginRight: 10,
  },
  genresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  genreText: {
    fontSize: 14,
    color: "#FF8C00",
    marginRight: 10,
  },
  description: {
    fontSize: 16,
    color: "#444",
    marginBottom: 10,
  },
  video: {
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
  retryButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#007AFF",
    borderRadius: 5,
  },
  retryText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default GameDetail;
