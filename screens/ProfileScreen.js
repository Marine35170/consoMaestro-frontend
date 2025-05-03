// ProfileScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function ProfileScreen() {
  const navigation = useNavigation();
  const handleFaq = () => navigation.navigate("FaqScreen");

  // --- États ---
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [rewardCount, setRewardCount] = useState(0);
  const [savedRecipesCount, setSavedRecipesCount] = useState(0);

  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editedEmail, setEditedEmail] = useState("");
  const [editedUsername, setEditedUsername] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [noChangesMessage, setNoChangesMessage] = useState("");

  // --- Récupère le profil au chargement ---
  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) return navigation.replace("AuthScreen");

      try {
        const res = await fetch(
          "https://conso-maestro-backend-eight.vercel.app/users/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const { user } = await res.json();
        setUsername(user.username);
        setEmail(user.email);
        setRewardCount(user.badges?.length || 0);
        setSavedRecipesCount(user.savedRecipes?.length || 0);
      } catch (e) {
        console.warn("Erreur fetch profile:", e);
      }
    })();
  }, []);

  // --- Déconnexion ---
  const handleSignOut = async () => {
    await AsyncStorage.removeItem("userToken");
    navigation.replace("AuthScreen");
  };

  // --- Ouvre la modal d’édition ---
  const handleEditProfile = () => {
    setEditedEmail(email);
    setEditedUsername(username);
    setNoChangesMessage("");
    setSuccessMessage("");
    setEditModalVisible(true);
  };

  // --- Mise à jour profil ---
  const handleUpdateUserInfo = async () => {
    const token = await AsyncStorage.getItem("userToken");
    const updateData = {};
    if (editedEmail && editedEmail !== email) updateData.email = editedEmail;
    if (editedUsername && editedUsername !== username)
      updateData.username = editedUsername;

    if (Object.keys(updateData).length === 0) {
      setNoChangesMessage("Aucune modification détectée.");
      setTimeout(() => setNoChangesMessage(""), 3000);
      return;
    }

    try {
      const res = await fetch(
        "https://conso-maestro-backend-eight.vercel.app/users/update",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );
      const data = await res.json();
      if (data.success) {
        if (updateData.email) setEmail(updateData.email);
        if (updateData.username) setUsername(updateData.username);
        setSuccessMessage("Profil mis à jour !");
      } else {
        setSuccessMessage("Erreur de mise à jour.");
      }
    } catch (e) {
      console.warn("Erreur update profile:", e);
      setSuccessMessage("Erreur réseau.");
    } finally {
      setTimeout(() => setSuccessMessage(""), 3000);
      setEditModalVisible(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons
          name="person-circle-outline"
          size={140}
          color={styles.theme.mainTitleColor}
        />
        <Text style={styles.username}>{username || "Utilisateur"}</Text>
      </View>

      {/* Grille centrée à 85% */}
      <View style={styles.grid}>
        <View style={[styles.card, { backgroundColor: styles.theme.gridBg }]}>
          <Text style={[styles.cardNumber, { color: styles.theme.subTitle }]}>
            {rewardCount}
          </Text>
          <Text style={[styles.cardLabel, { color: styles.theme.subTitle }]}>
            Mes récompenses
          </Text>
        </View>
        <View
          style={[
            styles.card,
            { backgroundColor: styles.theme.mainTitleColor },
          ]}
        >
          <Text style={[styles.cardNumber, { color: styles.theme.otherGrid }]}>
            {savedRecipesCount}
          </Text>
          <Text style={[styles.cardLabel, { color: styles.theme.otherGrid }]}>
            Mes recettes
          </Text>
        </View>
      </View>

      {/* Actions centrées à 85% */}
      <View style={styles.actions}>
        +{" "}
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: styles.theme.buttonBg,
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 16,
            },
          ]}
          onPress={handleEditProfile}
        >
          <Text style={[styles.buttonText, { color: styles.theme.otherGrid }]}>
            Modifier le profil
          </Text>
          <Ionicons
            name="chevron-forward-outline"
            size={20}
            color={styles.theme.otherGrid}
          />
        </TouchableOpacity>
        {/* Nouvelle entrée FAQ */}
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: styles.theme.buttonBg,
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 16,
            },
          ]}
          onPress={handleFaq}
        >
          <Text style={[styles.buttonText, { color: styles.theme.otherGrid }]}>
            FAQ & bonnes pratiques
          </Text>
          <Ionicons
            name="chevron-forward-outline"
            size={20}
            color={styles.theme.otherGrid}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: styles.theme.critickBtn,
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 16,
            },
          ]}
          onPress={handleSignOut}
        >
          <Text style={[styles.buttonText, { color: "#FFF" }]}>
            Déconnexion
          </Text>
          <Ionicons name="chevron-forward-outline" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Modal d'édition */}
      <Modal
        transparent
        visible={isEditModalVisible}
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Modifier mes infos</Text>
          {noChangesMessage ? (
            <Text style={styles.noChanges}>{noChangesMessage}</Text>
          ) : null}
          <TextInput
            style={styles.input}
            value={editedEmail}
            onChangeText={setEditedEmail}
            placeholder="Nouvel e-mail"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            value={editedUsername}
            onChangeText={setEditedUsername}
            placeholder="Nouveau pseudo"
          />
          <TouchableOpacity
            style={[styles.saveBtn, { backgroundColor: styles.theme.gridBg }]}
            onPress={handleUpdateUserInfo}
          >
            <Text style={[styles.saveTxt, { color: styles.theme.subTitle }]}>
              Enregistrer
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.saveBtn, { backgroundColor: "#ccc" }]}
            onPress={() => setEditModalVisible(false)}
          >
            <Text style={styles.saveTxt}>Annuler</Text>
          </TouchableOpacity>
          {successMessage ? (
            <Text style={styles.success}>{successMessage}</Text>
          ) : null}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  theme: {
    screenBg: "#fcf6ec",
    buttonBg: "#eee3cc",
    gridBg: "#F7E1A8",
    otherGrid: "#204825",
    mainTitleColor: "#a6c297",
    subTitle: "#ffb64b",
    critickBtn: "#EF6F5E",
  },
  screen: {
    flex: 1,
    backgroundColor: "#fcf6ec",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 50,
    marginTop: 40,
  },
  username: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffb64b",
  },

  // ← width 85% + centré
  grid: {
    width: "85%",
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  card: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 25,
    borderRadius: 12,
    marginHorizontal: 5,
  },
  cardNumber: {
    fontSize: 28,
    fontWeight: "bold",
  },
  cardLabel: {
    marginTop: 5,
    fontSize: 14,
  },

  // ← width 85% + centré
  actions: {
    width: "85%",
    alignSelf: "center",
    marginTop: 10,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  btnContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  /* --- Modal --- */
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 15,
  },
  noChanges: {
    color: "#ffb64b",
    textAlign: "center",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  saveBtn: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 6,
  },
  saveTxt: {
    fontWeight: "600",
    fontSize: 16,
  },
  success: {
    color: "lightgreen",
    textAlign: "center",
    marginTop: 10,
  },
});
