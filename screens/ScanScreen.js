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
      const json = await res.json();
      if (!json.result) {
        Alert.alert("Erreur", json.message);
        setScanned(false);
      } else {
        setProduct(json.product);
        setProductId(json.product._id);
        setShowModal(true);
      }
    } catch {
      Alert.alert("Erreur", "Impossible de récupérer le produit");
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

  // ==== FIN logique, début UI ====
  return (
    <SafeAreaView style={styles.screen}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          {/* Titre */}
          <Text style={styles.title}>Scannez votre produit</Text>

          {/* Scanner */}
          <View style={styles.scannerContainer}>
            <CameraView
              style={[
                styles.camera,
                isKeyboardVisible && { height: 150, width: 150 },
              ]}
              barcodeScannerEnabled
              onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            />
          </View>

          {/* OU */}
          <Text style={styles.or}>OU</Text>

          {/* Saisie */}
          <TextInput
            style={styles.input}
            placeholder="Je saisis mon code-barre…"
            placeholderTextColor="#664C25"
            keyboardType="numeric"
            value={barcodeData}
            onChangeText={setBarcodeData}
          />

          {/* Bouton Valider */}
          <TouchableOpacity
            style={styles.validateBtn}
            onPress={handleBarCodeWrite}
          >
            <View style={styles.btnRow}>
              <Text style={styles.validateText}>Valider mon code-barre</Text>
              <Ionicons
                name="chevron-forward-outline"
                size={20}
                color="#204825"
              />
            </View>
          </TouchableOpacity>

          {/* Check de confirmation */}
          <TouchableOpacity
            style={styles.confirmBtn}
            onPress={handleFinish}
          >
            <Ionicons name="checkmark" size={32} color="#fcf6ec" />
          </TouchableOpacity>

          {/* Modal DLC / stockage */}
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
  // ta palette
  theme: {
    screenBg:       "#fcf6ec",
    title:          "#204825",
    or:             "#ffb64b",
    scannerBorder:  "#204825",
    inputBorder:    "#a6c297",
    inputBg:        "#fcf6ec",
    validateBg:     "#F7E1A8",
    confirmBg:      "#204825",
    saveBg:         "#EF6F5E",
    saveTxt:        "#fcf6ec",
  },

  screen: {
    flex: 1,
    backgroundColor: "#FCF6EC",
  },
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "600",
    color: "#ffb64b",
    marginVertical: 20,
    marginTop: 40,
    marginBottom: 40,
  },

  scannerContainer: {
    width: "85%",
    aspectRatio: 1.2,
    borderWidth: 4,
    borderColor: "#a6c297",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 24,
  },
  camera: { flex: 1 },

  or: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#a6c297",
    marginBottom: 16,
  },

  input: {
    width: "85%",
    backgroundColor: "#FFF",
    borderColor: "#a6c297",
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 16,
    color: "#204825",
    marginBottom: 16,
  },

  validateBtn: {
    width: "85%",
    backgroundColor: "#eee3cc",
    borderRadius: 10,
    marginBottom: 24,
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  validateText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },

  confirmBtn: {
    width: 70,
    height: 70,
    borderRadius: 40,
    backgroundColor: "#ffb64b",
    alignItems: "center",
    justifyContent: "center",
  },

  // Modal styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fcf6ec",
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
    backgroundColor: "#fcf6ec",
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
    color: "#fcf6ec",
    fontSize: 16,
    fontWeight: "600",
  },
});
