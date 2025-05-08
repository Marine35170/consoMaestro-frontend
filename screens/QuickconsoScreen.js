// QuickConsoScreen.js
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  Platform,
} from "react-native";
import moment from "moment";
import { useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler";

// Palette
const COLORS = {
  bg: "#fcf6ec",
  white: "#fff",
  text: "#204825",
  mustard: "#fcdc90",
  placard: "#EEE3CC",
  red: "#EF6F5E",
  orange: "#f5a058",
  green: "#69914a",
  lightGreen: "#a6c297",
  black: "#333333",
};

// Lieux et icônes
const STORAGE_PLACES = ["Tous", "Frigo", "Congelo", "Placard"];
const ICONS = {
  Frigo: require("../assets/frigo.png"),
  Congelo: require("../assets/congelo.png"),
  Placard: require("../assets/placard.png"),
};

export default function QuickConsoScreen() {
  const userId = useSelector((s) => s.user.id);
  const isFocused = useIsFocused();

  // ── États
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("Tous");

  // ── FETCH ───────────────────────────────────────────
  useEffect(() => {
    if (!isFocused) return;
    (async () => {
      try {
        const res = await fetch(
          `https://conso-maestro-backend-eight.vercel.app/quickconso/${userId}`
        );
        const json = await res.json();
        if (json.result) {
          const sorted = json.data.sort(
            (a, b) => new Date(a.dlc) - new Date(b.dlc)
          );
          setProducts(sorted);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, [isFocused]);

  // ── SUPPRIMER UN PRODUIT ───────────────────────────
  const deleteOne = async (item) => {
    try {
      // 🔥 bien utiliser des backticks pour interpoler item._id
      const res = await fetch(
        `https://conso-maestro-backend-eight.vercel.app/products/${item._id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Suppression échouée");
      // mise à jour de l’UI
      setProducts(prev => prev.filter(p => p._id !== item._id));
    } catch (err) {
      console.error("deleteOne error:", err);
      Alert.alert("Erreur", "Impossible de supprimer ce produit.");
    }
  };
  

  // ── VIDER TOUT ─────────────────────────────────────
  const clearAll = () => {
    if (!products.length) return;
    Alert.alert(
      "Vider la liste ?",
      "Supprimer tous les produits à consommer rapidement ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Oui",
          style: "destructive",
          onPress: () => {
            const toDelete = [...products];
            setProducts([]);
            // 2. En tâche de fond, on envoie toutes les requêtes DELETE
            toDelete.forEach(async (p) => {
              try {
                await fetch(
                  `https://conso-maestro-backend-eight.vercel.app/products/${p._id}`,
                  { method: "DELETE" }
                );
              } catch (e) {
                console.error("Échec suppression produit", p._id, e);
              }
            });
          },
        },
      ]
    );
  };

  // ── CYCLE LIEU ─────────────────────────────────────
  const cyclePlace = async (item) => {
    const places = ["Frigo", "Congelo", "Placard"];
    const idx = places.indexOf(item.storagePlace);
    const next = places[(idx + 1) % places.length];
    try {
      const res = await fetch(
        `https://conso-maestro-backend-eight.vercel.app/products/${item._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newStoragePlace: next }),
        }
      );
      const j = await res.json();
      if (!j.result) throw new Error();
      setProducts((prev) =>
        prev
          .map((p) => (p._id === item._id ? { ...p, storagePlace: next } : p))
          .filter((p) => !(next === "Congelo" && p._id === item._id))
      );
    } catch {
      Alert.alert("Erreur", "Impossible de changer de lieu.");
    }
  };

  // ── FILTRAGE ────────────────────────────────────────
  const displayed =
    filter === "Tous"
      ? products
      : products.filter((p) => p.storagePlace === filter);

  // ── DLC UTILS ───────────────────────────────────────
  const daysRem = (dlc) => {
    const d = moment(dlc).diff(moment(), "days");
    return d < 0 ? "–" : `${d}j`;
  };
  const badgeColor = (dlc) => {
    const d = moment(dlc).diff(moment(), "days");
    if (d < 1) return styles.badgeRed;
    if (d <= 3) return styles.badgeOrange;
    if (d <= 4) return styles.badgeYellow;
    return styles.badgeGreen;
  };

  return (
    <SafeAreaView style={styles.screen}>
      {/* Title + clear */}
      <View style={styles.topRow}>
        <View style={styles.titileRow}>
          <Text style={styles.title}>À consommer</Text>
          <Text style={styles.titleYellow}>rapidement</Text>
        </View>
      </View>

      {/* Segmented control */}
      <View style={styles.filterRow}>
        {STORAGE_PLACES.map((f, i) => (
          <React.Fragment key={f}>
            {i > 0 && <View/>}
            <TouchableOpacity
              style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
              onPress={() => setFilter(f)}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === f && styles.filterTextActive,
                ]}
              >
                {f}
              </Text>
            </TouchableOpacity>
          </React.Fragment>
        ))}
      </View>

      {/* Liste avec Swipeable */}
      <FlatList
        data={displayed}
        keyExtractor={(p) => p._id}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <Text style={styles.empty}>Rien à consommer pour l’instant.</Text>
        }
        renderItem={({ item }) => {
          // actions à droite
          const renderRightActions = () => (
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={[styles.actionBtn, styles.moveBtn]}
                onPress={() => cyclePlace(item)}
              >
                <Ionicons
                  name="swap-horizontal-outline"
                  size={20}
                  color="#fff"
                />

                <Text style={styles.actionText}>Déplacer</Text>
              </TouchableOpacity>

              <View style={styles.separatorSwipe} />

              <TouchableOpacity
                style={[styles.actionBtn, styles.deleteBtn]}
                onPress={() => deleteOne(item)}
              >
                <Ionicons name="trash-outline" size={20} color="#fff" />
                <Text style={styles.actionText}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          );

          return (
            <Swipeable
              renderRightActions={renderRightActions}
              overshootRight={false}
            >
              <View style={styles.card}>
                {/* Cercle + icône */}
                <View
                  style={[
                    styles.circle,
                    item.storagePlace === "Frigo"
                      ? styles.circleFrigo
                      : item.storagePlace === "Congelo"
                      ? styles.circleFreezer
                      : styles.circlePlacard,
                  ]}
                >
                  <Image
                    source={ICONS[item.storagePlace]}
                    style={styles.circleIcon}
                  />
                </View>
                
                {/* Nom */}
                <Text style={styles.name}>{item.name}</Text>
               
                {/* Badge DLC */}
                <View style={[styles.badge, badgeColor(item.dlc)]}>
                  <Text style={styles.badgeText}>{daysRem(item.dlc)}</Text>
                </View>

                {/* Indicateur Swipe */}
                <View style={styles.swipeHint}>
                  <Ionicons
                    name="chevron-back-outline"
                    size={24}
                    color={COLORS.lightGreen}
                  />
                </View>
              </View>
            </Swipeable>
          );
        }}
      />
    </SafeAreaView>
  );
}

const SPACING = 4;
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FCF6EC" },

  topRow: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  titileRow: {
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 35,
    fontWeight: "700",
    color: "#a6c297",
    textAlign: "center",
  },
  titleYellow: {
    fontSize: 35,
    fontWeight: "700",
    color: "#ffb64b",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 10,
  },
  /* Filter */
  filterRow: {
    flexDirection: "row",
    backgroundColor: "#fff5d7",
    borderRadius: 30,
    marginHorizontal: 16,
    marginTop: 12,
    overflow: "hidden",
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  filterBtnActive: {
    backgroundColor: "#ffb64b",
    borderRadius: 20,
  },
  filterText: { 
    color: COLORS.text 
  },
  filterTextActive: { 
    color: COLORS.white, 
    fontWeight: "600" 
  },
  empty: {
    textAlign: "center",
    color: "#999",
    marginTop: 40,
  },

  /* Card */
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 12,
    marginBottom: 12,
  },
  circle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  circleFrigo: { backgroundColor: COLORS.lightGreen },
  circleFreezer: { backgroundColor: "#fcdc90" },
  circlePlacard: { backgroundColor: COLORS.lightGreen },
  circleIcon: { width: 30, height: 30 },

  name: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    ...Platform.select({
      ios: { fontWeight: "700" },
      android: { fontFamily: "sans-serif-medium" },
    }),
  },

  badge: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  badgeText: { color: COLORS.white, fontWeight: "600", fontSize: 12 },
  badgeRed: { backgroundColor: COLORS.red },
  badgeOrange: { backgroundColor: COLORS.orange },
  badgeGreen: { backgroundColor: COLORS.lightGreen },
  badgeYellow: { backgroundColor: COLORS.mustard },

  /* Swipe actions */
  actionsContainer: {
    flexDirection: "row",
    width: 200,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  actionBtn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    marginBottom: 12,
  },
  moveBtn: {
    backgroundColor: COLORS.lightGreen,
    paddingLeft: 15,
  },
  separatorSwipe: {
    width: 1,
    height: "60%", // 60% de la hauteur de la carte
    alignSelf: "center",
    backgroundColor: "#FFF",
    marginVertical: SPACING * 2,
  },
  deleteBtn: {
    backgroundColor: COLORS.red,
    borderEndEndRadius: 20,
    borderBottomEndRadius: 20,
    borderStartEndRadius: 20,
  },
  actionText: {
    color: "#fff",
    marginTop: 4,
    fontSize: 12,
    paddingLeft: 15,
  },
});
