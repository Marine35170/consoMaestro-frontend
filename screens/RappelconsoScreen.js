// RappelConsoScreen.js
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function RappelConsoScreen() {
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState("");
  const isFocused = useIsFocused();
  const userId = useSelector((state) => state.user.id);

  const fetchRecalls = async () => {
    try {
      const response = await fetch(
        `http://conso-maestro-backend.vercel.app/rappels/check-recall/${userId}`
      );
      const data = await response.json();
      if (data?.recalls?.length) {
        const unique = data.recalls.filter((r, i, arr) =>
          i === arr.findIndex((o) =>
            o.nom_de_la_marque_du_produit === r.nom_de_la_marque_du_produit
          )
        );
        setSearchResults(unique);
      } else {
        setSearchResults([]);
      }
    } catch (e) {
      console.error(e);
      setError("Erreur de chargement");
    }
  };

  useEffect(() => {
    if (isFocused) fetchRecalls();
  }, [isFocused]);

  return (
    <SafeAreaView style={styles.screen}>
      {/* Header */}
      <Text style={styles.title}>Alertes sécurité sanitaire</Text>

      {/* Carte résumé */}
      <View style={styles.summaryCard}>
        <Ionicons
          name="warning-outline"
          size={28}
          color="#ffb64b"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.summaryText}>
          {searchResults.length} alertes
        </Text>
      </View>

      {/* Message d'erreur ou de liste vide */}
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : searchResults.length === 0 ? (
        <Text style={styles.emptyText}>Aucune alerte pour le moment.</Text>
      ) : (

        /* Liste des rappels */
        <View style={styles.listContainer}>
          <ScrollView
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          >
            {searchResults.map((recall, idx) => (
              <View key={idx} style={styles.listItem}>
                <View>
                  <Text style={styles.itemTitle}>
                    {recall.nom_de_la_marque_du_produit}
                  </Text>
                  <Text style={styles.itemSubtitle}>
                    {recall.motif_du_rappel}
                  </Text>
                  {recall.date_publication && (
                    <Text style={styles.itemDate}>
                      {new Date(recall.date_publication).toLocaleDateString()}
                    </Text>
                  )}
                </View>
                <Ionicons
                  name="chevron-forward-outline"
                  size={20}
                  color="#204825"
                />
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fcf6ec",
  },
  title: {
    fontSize: 30,
    fontWeight: "600",
    color: "#EF6F5E",
    textAlign: "center",
    marginVertical: 20,
    marginTop: 60,
    marginBottom: 40,
  },
  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7E1A8",
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
  },
  summaryText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#204825",
  },
  errorText: {
    color: "#EF6F5E",
    textAlign: "center",
    marginTop: 20,
  },
  emptyText: {
    color: "#666",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  listContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  listContent: {
    paddingBottom: 24,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FAF9F3",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#204825",
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    color: "#666666",
  },
  itemDate: {
    marginTop: 4,
    fontSize: 12,
    color: "#999999",
  },
});
