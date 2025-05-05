// InventaireScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from "react-native";
import moment from "moment";
import { useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function InventaireScreen() {
  const userId = useSelector((s) => s.user.id);
  const isFocused = useIsFocused();

  // ── ➊ On gère localement le storageType
  const [storageType, setStorageType] = useState("frigo");
  const [productsInfo, setProductsInfo] = useState([]);
  const [refresh, setRefresh] = useState(false);

  // ── ➋ Fetch à chaque fois que STORAGE_TYPE ou FOCUS change
  useEffect(() => {
    if (!isFocused) return;
    (async () => {
      try {
        const res = await fetch(
          `https://conso-maestro-backend-eight.vercel.app/inventaire/${userId}/${storageType}`
        );
        const json = await res.json();
        if (!json.result) {
          throw new Error(json.message);
        }
        // tri par DLC ascendante
        setProductsInfo(
          json.data.sort((a, b) => new Date(a.dlc) - new Date(b.dlc))
        );
      } catch (err) {
        console.error("Erreur fetch inventaire:", err);
        Alert.alert("Erreur", err.message);
      }
    })();
  }, [isFocused, storageType, refresh]);

  // ── ➌ Boutons de choix de stockage
  const renderStorageButtons = () => (
    <View style={styles.stocksButtonsContainer}>
      {[
        { key: "frigo",  label: "Mon Frigo" },
        { key: "congelo", label: "Mon Congélo" },
        { key: "placard", label: "Mon Placard" },
      ].map(({ key, label }) => (
        <TouchableOpacity
          key={key}
          style={[
            styles.button,
            storageType === key && styles.buttonActive
          ]}
          onPress={() => setStorageType(key)}
        >
          <Text style={styles.buttonText}>{label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // ── ➍ Rendu des lignes
  const renderProduct = (data, i) => {
    const daysRemaining = moment(data.dlc).diff(moment(), "days");
    const formatted = daysRemaining < 0 ? "–" : `${daysRemaining}j`;
    const colorBadge =
      daysRemaining < 0 ? styles.blackDlcContainer
      : daysRemaining <= 2 ? styles.redDlcContainer
      : daysRemaining <= 4 ? styles.orangeDlcContainer
      : styles.greenDlcContainer;

    // Icone / style selon storageType
    const icons = {
      frigo: require("../assets/frigo.png"),
      congelo: require("../assets/congelo.png"),
      placard: require("../assets/placard.png"),
    };

    return (
      <View style={styles.ProductLineContainer} key={data._id || i}>
        <Text style={styles.ProductTitle}>{data.name}</Text>
        <TouchableOpacity onPress={() => Alert.alert("DLC", formatted)}>
          <View style={[styles.DlcContainer, colorBadge]}>
            <Text style={styles.DlcText}>{formatted}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          // rotation logique inchangée
          const next =
            data.storagePlace === "Frigo"   ? "Congelo" :
            data.storagePlace === "Congelo"  ? "Placard" :
                                                "Frigo";
          fetch(`https://conso-maestro-backend-eight.vercel.app/products/${data._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ newStoragePlace: next }),
          }).then(() => setRefresh(r => !r))
            .catch(console.error);
        }}>
          <Image source={icons[data.storagePlace.toLowerCase()]} style={styles.freezerLogo} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          fetch(`https://conso-maestro-backend-eight.vercel.app/products/${data._id}`, {
            method: "DELETE"
          }).then(() => setRefresh(r => !r))
            .catch(console.error);
        }}>
          <FontAwesomeIcon icon={faXmark} size={20} color="#FF4C4C" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.PageTitle}>Mon Frigo</Text>

      {/* ➌ */}
      {renderStorageButtons()}

      {/* ➍ */}
      <View style={styles.productContainer}>
        <ScrollView>
          {productsInfo.map(renderProduct)}
          {productsInfo.length === 0 && (
            <Text style={styles.noProducts}>Aucun produit</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, alignItems: "center", paddingTop: 50,
    backgroundColor: "#FCF6EC",
  },
  PageTitle: {
    fontSize: 35, fontWeight: "700", color: "#ffb64b", marginBottom: 20,
  },
  stocksButtonsContainer: {
    flexDirection: "row",
    backgroundColor: "#fff5d7",
    borderRadius: 30,
    marginHorizontal: 16,
    marginTop: 12,
    overflow: "hidden",
    },
  button: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  buttonActive: {
    backgroundColor: "#ffb64b",
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 14,
    color: "#FFF",
    fontWeight: "600",
  },
  buttonTextActive: { color: "#FFF", fontWeight: "600" },

  productContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 12,
    marginBottom: 12,
  
  },
  ProductLineContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 10,
    marginVertical: 4,
  },
  ProductTitle: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 14,
  },
  DlcContainer: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginHorizontal: 8,
  },
  DlcText: { color: "#FFF", fontWeight: "600" },
  redDlcContainer: { backgroundColor: "#FF6347" },
  orangeDlcContainer: { backgroundColor: "#FFA500" },
  greenDlcContainer: { backgroundColor: "#69914a" },
  blackDlcContainer: { backgroundColor: "#000" },
  freezerLogo: { width: 24, height: 24, marginHorizontal: 8 },
  noProducts: { textAlign: "center", marginTop: 20, color: "#444" },
});
