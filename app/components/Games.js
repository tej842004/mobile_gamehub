import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";

import axios from "axios";

import Screen from "./Screen";
import AppTextInput from "./AppTextInput";
import Picker from "../components/Picker";
import GameCard from "./GameCard";
import ActivityIndicator from "./ActivityIndicator";

const API_KEY = "c47130622d90458cba607aecc8ef2756";
const BASE_URL = `https://api.rawg.io/api`;

const Games = ({ navigation }) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [genres, setGenres] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    resetAndFetchGames();
  }, [selectedGenre, selectedPlatform, searchQuery]);

  const fetchFilters = async () => {
    try {
      const genresRes = await axios.get(`${BASE_URL}/genres?key=${API_KEY}`);
      const platformsRes = await axios.get(
        `${BASE_URL}/platforms?key=${API_KEY}`
      );

      setGenres(genresRes.data.results);
      setPlatforms(platformsRes.data.results);
    } catch (error) {
      console.error("Error fetching filters:", error);
    }
  };

  const resetAndFetchGames = () => {
    setGames([]);
    setPage(1);
    setHasMore(true);
    fetchGames(1);
  };

  const loadMoreGames = () => {
    if (!loading) fetchGames(page);
  };

  const fetchGames = async (pageNumber) => {
    if (!hasMore) return;
    setLoading(true);
    try {
      let url = `${BASE_URL}/games?key=${API_KEY}&page=${pageNumber}&page_size=10`;
      if (searchQuery) url += `&search=${searchQuery}`;
      if (selectedGenre) url += `&genres=${selectedGenre.id}`;
      if (selectedPlatform) url += `&platforms=${selectedPlatform.id}`;

      const response = await axios.get(url);
      setGames((prevGames) => [...prevGames, ...response.data.results]);
      setPage(pageNumber + 1);
      setHasMore(response.data.results.length > 0);
    } catch (error) {
      console.error("Error fetching games:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen style={styles.container}>
      <AppTextInput
        icon="magnify"
        placeholder="Search..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <View style={styles.pickerContainer}>
        <Picker
          placeholder="Genre"
          icon="shape"
          selectedItem={selectedGenre}
          onSelectItem={(item) => setSelectedGenre(item)}
          items={genres}
        />
        <Picker
          placeholder="Platform"
          icon="controller-classic"
          items={platforms}
          selectedItem={selectedPlatform}
          onSelectItem={(item) => setSelectedPlatform(item)}
        />
      </View>

      <FlatList
        data={games}
        keyExtractor={(item, index) =>
          item.id ? item.id.toString() : index.toString()
        }
        renderItem={({ item }) => (
          <GameCard
            onPress={() =>
              navigation.navigate("GameDetail", { gameId: item.id })
            }
            item={item}
          />
        )}
        onEndReached={loadMoreGames}
        onEndReachedThreshold={0.5}
        ListFooterComponent={<ActivityIndicator visible={loading} />}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 7,
  },
  pickerContainer: {
    width: "50%",
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
});

export default Games;
