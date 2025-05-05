// ScanScreen.js
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import { CameraView, Camera } from "expo-camera";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

export default function ScanScreen() {
  // ==== logique inchangée ====
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [barcodeData, setBarcodeData] = useState("");
  const [product, setProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [dlc, setDlc] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [storagePlace, setStoragePlace] = useState("");
  const [productId, setProductId] = useState(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const userId = useSelector((state) => state.user.id);
  const navigation = useNavigation();

  const fridgeImage   = require("../assets/frigo.png");
  const freezerImage  = require("../assets/congelo.png");
  const cupboardImage = require("../assets/placard.png");

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () => setIsKeyboardVisible(true));
    const hide = Keyboard.addListener("keyboardDidHide", () => setIsKeyboardVisible(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    setBarcodeData(data);
    fetchProductData(userId, data);
  };
  const handleBarCodeWrite = () => {
    setScanned(true);
    fetchProductData(userId, barcodeData);
  };
  const fetchProductData = async (userId, data) => {
    try {
      const res = await fetch(
        `https://conso-maestro-backend-eight.vercel.app/products/${userId}/${data}`
      );
  
      // 1. Log du status et des headers
      console.log("FetchProductData – status:", res.status);
      console.log("FetchProductData – headers:", JSON.stringify(res.headers, null, 2));
  
      // 2. On récupère le texte brut pour voir ce que renvoie vraiment le serveur
      const raw = await res.text();
      console.log("FetchProductData – raw response:", raw);
  
      // 3. On essaie de parser ce texte en JSON
      let json;
      try {
        json = JSON.parse(raw);
      } catch (err) {
        console.error("FetchProductData – JSON parse error:", err);
        Alert.alert("Erreur", "Réponse serveur invalide");
        setScanned(false);
        return;
      }
  
      // 4. Si le status HTTP n’est pas OK, on affiche l’erreur renvoyée
      if (!res.ok) {
        console.error("FetchProductData – HTTP error:", res.status, json.message);
        Alert.alert("Erreur", json.message || `Erreur serveur (${res.status})`);
        setScanned(false);
        return;
      }
  
      // 5. Ensuite ton traitement habituel
      if (!json.result) {
        Alert.alert("Erreur", json.message);
        setScanned(false);
      } else {
        setProduct(json.product);
        setProductId(json.product._id);
        setShowModal(true);
      }
    } catch (err) {
      console.error("FetchProductData – network error:", err);
      Alert.alert("Erreur", "Impossible de récupérer le produit");
      setScanned(false);
    }
  };
  
  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const handleConfirm  = (date) => {
    setDlc(date);
    hideDatePicker();
  };
  const saveProduct = async () => {
    if (!dlc || !storagePlace) {
      Alert.alert("Erreur", "Sélectionnez DLC + lieu de stockage");
      return;
    }
    const fDlc = dlc.toISOString().split("T")[0];
    try {
      const res = await fetch(
        `https://conso-maestro-backend-eight.vercel.app/products/${fDlc}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            upc: barcodeData,
            dlc: fDlc,
            user: userId,
            _id: productId,
            storagePlace,
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        Alert.alert("Succès", data.message);
        setShowModal(false);
        setScanned(false);
        setBarcodeData("");
        setProductId(null);

        navigation.navigate("RappelConso");
      } else {
        Alert.alert("Erreur", data.message);
      }
    } catch {
      Alert.alert("Erreur", "Connexion impossible");
    }
  };

  if (hasPermission === null)  return <Text>Chargement caméra…</Text>;
  if (hasPermission === false) return <Text>Pas d’accès caméra</Text>;

  const handleFinish = () => navigation.navigate("Menu");

  // ==== UI mise à jour ====
  return (
    <SafeAreaView style={styles.screen}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          {/* 1. Titre */}
          <Text style={styles.title}>Scannez votre produit</Text>

          {/* 2. Zone scan */}
          <View style={styles.scannerContainer}>
            <CameraView
              style={[
                styles.camera,
                isKeyboardVisible && { height: 150, width: 150 }
              ]}
              barcodeScannerEnabled
              onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            />
          </View>

          {/* 3. Saisie manuelle */}
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Saisissez le code-barre…"
              placeholderTextColor="#664C25"
              keyboardType="numeric"
              value={barcodeData}
              onChangeText={setBarcodeData}
              returnKeyType="send"
              onSubmitEditing={handleBarCodeWrite}
            />
            <TouchableOpacity onPress={handleBarCodeWrite}>
              <Ionicons
                name="chevron-forward-outline"
                size={24}
                color="#204825"
              />
            </TouchableOpacity>
          </View>

          {/* 4. Bouton ✓ */}
          <TouchableOpacity
            style={styles.confirmBtn}
            onPress={handleFinish}
          >
            <Ionicons name="checkmark" size={32} color="#FCF6EC" />
          </TouchableOpacity>

          {/* 5. Modal (inchangé) */}
          <Modal visible={showModal} animationType="slide" transparent>
            <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
              <View style={styles.modalBackdrop} />
            </TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{product?.name}</Text>
              <Text style={styles.modalLabel}>
                Choisissez lieu de stockage :
              </Text>
              <View style={styles.storageRow}>
                {[
                  { label: "Frigo", image: fridgeImage },
                  { label: "Congelo", image: freezerImage },
                  { label: "Placard", image: cupboardImage },
                ].map((p) => (
                  <TouchableOpacity
                    key={p.label}
                    onPress={() => setStoragePlace(p.label)}
                  >
                    <View
                      style={[
                        styles.storageBox,
                        storagePlace === p.label
                          ? styles.storageBoxSelected
                          : styles.storageBoxUnselected,
                      ]}
                    >
                      <Image source={p.image} style={styles.storageIcon} />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                style={styles.datePickerBtn}
                onPress={showDatePicker}
              >
                <Text style={styles.datePickerText}>
                  {dlc
                    ? dlc.toLocaleDateString()
                    : "Sélectionner la DLC"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={saveProduct}
              >
                <Text style={styles.saveTxt}>Enregistrer</Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              />
            </View>
          </Modal>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FCF6EC",
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
  },
  title: {
    fontSize: 30,
    fontWeight: "600",
    color: "#a6c297",
    marginBottom: 60,
    marginTop: 20,  
  },
  scannerContainer: {
    width: "90%",
    aspectRatio: 1.2,
    borderWidth: 6,
    borderColor: "#a6c297",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 60,
  },
  camera: {
    flex: 1,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#a6c297",
    borderRadius: 20,
    paddingHorizontal: 12,
    marginBottom: 60,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: "#204825",
  },
  confirmBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#ffb64b",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  /* Styles de la modal (inchangés) */
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#FCF6EC",
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#204825",
    marginBottom: 12,
    textAlign: "center",
  },
  modalLabel: {
    fontSize: 16,
    color: "#ffb64b",
    marginBottom: 12,
  },
  storageRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  storageBox: {
    padding: 10,
    borderRadius: 12,
  },
  storageBoxSelected: {
    backgroundColor: "#ffb64b",
  },
  storageBoxUnselected: {
    backgroundColor: "#eee3cc",
  },
  storageIcon: {
    width: 48,
    height: 48,
  },
  datePickerBtn: {
    backgroundColor: "#FCF6EC",
    borderColor: "#a6c297",
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  datePickerText: {
    color: "#204825",
    fontSize: 16,
  },
  saveBtn: {
    backgroundColor: "#EF6F5E",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  saveTxt: {
    color: "#FCF6EC",
    fontSize: 16,
    fontWeight: "600",
  },
});
