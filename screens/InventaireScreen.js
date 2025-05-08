// InventaireScreen.js
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
} from "react-native";
import moment from "moment";
import { useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

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

// Icônes
const ICONS = {
  frigo: require("../assets/frigo.png"),
  congelo: require("../assets/congelo.png"),
  placard: require("../assets/placard.png"),
};

export default function InventaireScreen() {
  const userId = useSelector((s) => s.user.id);
  const isFocused = useIsFocused();

  // ── États
  const [storageType, setStorageType] = useState("frigo");
  const [products, setProducts] = useState([]);
  const [refresh, setRefresh] = useState(false);

  // ── Fetch selon storageType
  useEffect(() => {
    if (!isFocused) return;
    (async () => {
      try {
        const res = await fetch(
          `https://conso-maestro-backend-eight.vercel.app/inventaire/${userId}/${storageType}`
        );
        const json = await res.json();
        if (!json.result) throw new Error(json.message);
        setProducts(
          json.data.sort((a, b) => new Date(a.dlc) - new Date(b.dlc))
        );
      } catch (err) {
        console.error(err);
        Alert.alert("Erreur", err.message);
      }
    })();
  }, [isFocused, storageType, refresh]);

  // ── Supprimer un produit
  const deleteOne = async (item) => {
    try {
      await fetch(
        `https://conso-maestro-backend-eight.vercel.app/products/${item._id}`,
        { method: "DELETE" }
      );
      setProducts((p) => p.filter((x) => x._id !== item._id));
    } catch (err) {
      console.error("deleteOne error:", err);
      Alert.alert("Erreur", "Impossible de supprimer ce produit.");
    }
  };

  // ── Changer de storage (cycle)
  const cyclePlace = async (item) => {
    const order = ["frigo", "congelo", "placard"];
    const idx = order.indexOf(item.storagePlace.toLowerCase());
    const next = order[(idx + 1) % order.length];
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
          .map((p) =>
            p._id === item._id ? { ...p, storagePlace: next } : p
          )
          // si on congèle, on retire de cette liste
          .filter((p) =>
            next === "congelo" && p._id === item._id ? false : true
          )
      );
    } catch {
      Alert.alert("Erreur", "Impossible de déplacer");
    }
  };

  // ── Dynamic title/map des boutons
  const storageLabels = {
    frigo: "Mon Frigo",
    congelo: "Mon Congélo",
    placard: "Mes Placards",
  };
  const options = ["frigo", "congelo", "placard"];

  // ── Utilitaires DLC
  const daysRem = (dlc) => {
    const d = moment(dlc).diff(moment(), "days");
    return d < 0 ? "–" : `${d}j`;
  };
  const badgeColor = (dlc) => {
    const d = moment(dlc).diff(moment(), "days");
    if (d < 0) return styles.badgeBlack;
    if (d <= 2) return styles.badgeRed;
    if (d <= 4) return styles.badgeOrange;
    return styles.badgeGreen;
  };

  return (
    <SafeAreaView style={styles.screen}>
      {/* Title dynamique */}
      <Text style={styles.PageTitle}>{storageLabels[storageType]}</Text>

      {/* Segmented control */}
      <View style={styles.filterRow}>
        {options.map((key, i) => (
          <React.Fragment key={key}>
            {i > 0 && <View style={styles.separator} />}
            <TouchableOpacity
              onPress={() => setStorageType(key)}
              style={[
                styles.filterBtn,
                storageType === key && styles.filterBtnActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  storageType === key && styles.filterTextActive,
                ]}
              >
                {storageLabels[key]}
              </Text>
            </TouchableOpacity>
          </React.Fragment>
        ))}
      </View>

      {/* Liste Swipeable */}
      <FlatList
        data={products}
        keyExtractor={(p) => p._id}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <Text style={styles.empty}>Aucun produit</Text>
        }
        renderItem={({ item }) => {
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
                {/* Cercle icône */}
                <View
                  style={[
                    styles.circle,
                    item.storagePlace.toLowerCase() === "frigo"
                      ? styles.circleFrigo
                      : item.storagePlace.toLowerCase() === "congelo"
                      ? styles.circleFreezer
                      : styles.circlePlacard,
                  ]}
                >
                  <Image
                    source={ICONS[item.storagePlace.toLowerCase()]}
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

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },

  /* Title + Segmented */
  PageTitle: {
    fontSize: 35,
    fontWeight: "700",
    color: "#ffb64b",
    textAlign: "center",
    marginVertical: 12,
  },
  filterRow: {
    flexDirection: "row",
    backgroundColor: COLORS.placard,
    borderRadius: 24,
    marginHorizontal: 16,
    overflow: "hidden",
  },
  filterBtn: {
    flex: 1,
    padding: 10,
    alignItems: "center",
  },
  filterBtnActive: {
    backgroundColor: "#ffb64b",
    borderRadius: 20,
  },
  filterText: {
    color: COLORS.text,
  },
  filterTextActive: {
    color: COLORS.white,
    fontWeight: "600",
  },

  /* Empty */
  empty: {
    textAlign: "center",
    color: "#999",
    marginTop: 40,
  },

  /* Card produit */
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
  circleFreezer: { backgroundColor: COLORS.mustard },
  circlePlacard: { backgroundColor: COLORS.lightGreen },
  circleIcon: { width: 28, height: 28 },

  name: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },

  badge: {
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginRight: 12,
  },
  badgeText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 12,
  },
  badgeRed: { backgroundColor: COLORS.red },
  badgeOrange: { backgroundColor: COLORS.orange },
  badgeGreen: { backgroundColor: COLORS.green },
  badgeBlack: { backgroundColor: COLORS.black },

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
    paddingLeft: 20,
  },
  deleteBtn: {
    backgroundColor: COLORS.red,
    borderEndEndRadius: 20,
    borderBottomEndRadius: 20,
    borderStartEndRadius: 20,
  },
  separatorSwipe: {
    width: 1,
    backgroundColor: COLORS.white,
    marginVertical: 12,
  },
  actionText: {
    color: COLORS.white,
    fontSize: 12,
    marginTop: 4,
  },

  swipeHint: {
    marginLeft: 8,
  },
});
