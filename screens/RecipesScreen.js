// RecipesScreen.js
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

const DAILY_LIMIT = 50;    // nombre max de recettes par jour
const PER_PAGE    = 10;    // nombre de recettes récupérées par page

export default function RecipesScreen() {
  // ─── 1) Récupération safe de userId ─────────────────────────────
  const reduxState = useSelector((s) =>
    s.user
      ? s.user
      : s.auth && s.auth.user
      ? s.auth.user
      : {}
  );
  const userId = reduxState.id ?? reduxState.userId ?? null;

  // ─── 2) Garde loader tant que userId manquant ──────────────────
  if (!userId) {
    return (
      <SafeAreaView style={styles.screen}>
        <ActivityIndicator size="large" color="#204825" style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  // ─── 3) États locaux ────────────────────────────────────────────
  const [recipes, setRecipes]       = useState([]);
  const [favorites, setFavorites]   = useState([]);
  const [page, setPage]             = useState(1);
  const [loading, setLoading]       = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Toutes");

  // compteur quotidien
  const [dailyCount, setDailyCount] = useState(0);

  // ─── 4) Initialisation du compteur ─────────────────────────────
  useEffect(() => {
    const initCount = async () => {
      const savedDate  = await AsyncStorage.getItem("recipesFetchDate");
      const savedCount = parseInt(
        await AsyncStorage.getItem("recipesFetchCount") || "0",
        10
      );
      const today = new Date().toISOString().slice(0, 10);
      if (savedDate !== today) {
        await AsyncStorage.setItem("recipesFetchDate", today);
        await AsyncStorage.setItem("recipesFetchCount", "0");
        setDailyCount(0);
      } else {
        setDailyCount(savedCount);
      }
    };
    initCount();
  }, []);

  const incrementCount = async (n) => {
    const newCount = dailyCount + n;
    setDailyCount(newCount);
    await AsyncStorage.setItem("recipesFetchCount", String(newCount));
  };

  // ─── 5) Fetch des recettes avec contrôle de la limite ──────────
  const fetchRecipes = async (newPage = 1) => {
    // limite atteinte ?
    if (dailyCount + PER_PAGE > DAILY_LIMIT) {
      setLoading(false);
      setLoadingMore(false);
      return Alert.alert(
        "Limite journalière atteinte",
        "Vous avez atteint votre quota de recettes pour aujourd’hui."
      );
    }

    try {
      newPage === 1 ? setLoading(true) : setLoadingMore(true);
      const res  = await fetch(
        `https://conso-maestro-backend-eight.vercel.app/recipes/spoonacular?page=${newPage}`
      );
      const data = await res.json();
      const list = Array.isArray(data.recipes) ? data.recipes : [];

      setRecipes((prev) =>
        newPage === 1 ? list : [...prev, ...list]
      );
      // incrémenter selon le nombre réellement récupéré
      await incrementCount(list.length);
    } catch (e) {
      console.error(e);
      Alert.alert("Erreur", "Impossible de charger les recettes.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // ─── 6) Fetch des favoris ───────────────────────────────────────
  const fetchFavorites = async () => {
    try {
      const res  = await fetch(
        `https://conso-maestro-backend-eight.vercel.app/recipes/favorites/${userId}`
      );
      const data = await res.json();
      const arr  = Array.isArray(data.favorites) ? data.favorites : [];
      setFavorites(arr.map((f) => Number(f.id)));
    } catch (e) {
      console.error(e);
    }
  };

  // ─── 7) Toggle favori (optimistic + rollback) ─────────────────
  const toggleFavorite = async (recipe) => {
    const recipeId = Number(recipe.id);
    const isFav    = favorites.includes(recipeId);

    // Optimistic UI
    setFavorites((prev) =>
      isFav ? prev.filter((id) => id !== recipeId) : [...prev, recipeId]
    );

    const url = `https://conso-maestro-backend-eight.vercel.app/recipes/${recipeId}`;
    const opts = isFav
      ? {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }
      : {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            recipeId,
            title: recipe.title,
            image: recipe.image,
            description: recipe.description || "",
            products: Array.isArray(recipe.extendedIngredients)
              ? recipe.extendedIngredients.map((i) => i.name)
              : [],
          }),
        };

    try {
      const res = await fetch(url, opts);
      if (!res.ok) throw new Error(await res.text());
    } catch (e) {
      // rollback
      setFavorites((prev) =>
        isFav ? [...prev, recipeId] : prev.filter((id) => id !== recipeId)
      );
      console.error("toggleFavorite error:", e);
    }
  };

  // ─── 8) Hooks initiaux ────────────────────────────────────────
  useEffect(() => {
    fetchRecipes(1);
    fetchFavorites();
  }, [userId, dailyCount]);

  // ─── 9) Pagination ────────────────────────────────────────────
  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchRecipes(next);
  };

  // ─── 10) Tri des données selon l’onglet ───────────────────────
  const favoriteRecipes = recipes.filter((r) =>
    favorites.includes(Number(r.id))
  );
  const dataToShow =
    selectedTab === "Favoris" ? favoriteRecipes : recipes;

  return (
    <SafeAreaView style={styles.screen}>
      {/* Header */}
      <Text style={styles.headerTitle}>Idées recettes</Text>

      {/* Segment control */}
      <View style={styles.segment}>
        {["Toutes", "Favoris"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.segmentTab,
              selectedTab === tab && styles.segmentTabActive,
            ]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text
              style={[
                styles.segmentText,
                selectedTab === tab && styles.segmentTextActive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Loader initial */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#204825"
          style={{ flex: 1 }}
        />
      ) : (
        <FlatList
          data={dataToShow}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.info}>
                <Text style={styles.title} numberOfLines={2}>
                  {item.title}
                </Text>
                <TouchableOpacity
                  onPress={() => toggleFavorite(item)}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                >
                  <Ionicons
                    name={
                      favorites.includes(Number(item.id))
                        ? "heart"
                        : "heart-outline"
                    }
                    size={20}
                    color={
                      favorites.includes(Number(item.id))
                        ? "#EF6F5E"
                        : "#999"
                    }
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator size="small" color="#204825" />
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FCF6EC",
    paddingTop: Platform.OS === "ios" ? 50 : 20,
  },
  headerTitle: {
    fontSize: 35,
    fontWeight: "600",
    color: "#a6c297",
    textAlign: "center",
    marginBottom: 16,
    marginTop: 20,
  },
  segment: {
    flexDirection: "row",
    alignSelf: "center",
    backgroundColor: "#fcf6ec",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 20,
  },
  segmentTab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  segmentTabActive: {
    backgroundColor: "#F7E1A8",
  },
  segmentText: {
    fontSize: 16,
    color: "#ffb64b",
  },
  segmentTextActive: {
    fontWeight: "600",
  },
  row: {
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#FAF9F3",
    borderRadius: 12,
    width: "48%",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 120,
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 8,
  },
  title: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#204825",
    marginRight: 6,
  },
});
