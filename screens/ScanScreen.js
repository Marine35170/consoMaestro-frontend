import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Button,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Modal,
  Alert,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useSelector } from "react-redux";

export default function ScanScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [barcodeData, setBarcodeData] = useState(null);
  const [product, setProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [dlc, setDlc] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const userId = useSelector((state) => state.user.id);
  {/*Permission camera */}
  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };
    getBarCodeScannerPermissions();
  }, []);
  {/*Recuperation de l'UPC  via le scan */}
  const handleBarCodeScanned = ({ data }) => {
    console.log("Code-barres scanné : ", data);
    setScanned(true);
    setBarcodeData(data);
    try {
      fetch(
        `https://conso-maestro-backend.vercel.app/products/${userId}/${data}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Données récupérées : ", data);
          setProduct(data.product);
          setShowModal(true);
          console.log(data);
        });
    } catch (error) {
      console.error(error);
    }
  };
  {/*Afficher le calendrier */}
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  {/*Cacher le calendrier */}
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  {/*Comfirmer la date*/}
  const handleConfirm = (date) => {
    setDlc(date);
    hideDatePicker();
  };
  {/*Comfirmer la DLC pour le produit*/}
  const saveProduct = async () => {
    if (!dlc) {
      Alert.alert("Erreur", "Veuillez sélectionner une DLC");
      return;
    }

    const formattedDlc = dlc.toISOString().split("T")[0];
    try {
      {/*Ajout de la DLC au produit en BDD */}
      const response = await fetch(
        `https://conso-maestro-backend.vercel.app/products/${formattedDlc}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            upc: barcodeData,
            dlc: formattedDlc,
            user: userId,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Succès", data.message);
        setShowModal(false);
      } else {
        Alert.alert(
          "Erreur",
          data.message || "Échec de l'enregistrement de la DLC"
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Erreur de connexion au serveur");
    }
  };

  if (hasPermission === null) {
    return <Text>Demande de permission de la caméra...</Text>;
  }
  if (hasPermission === false) {
    return <Text>Pas d'accès à la caméra</Text>;
  }

  return (
    <ImageBackground
      source={require("../assets/backgroundScanne.png")}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.text}>Scannez votre produit</Text>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={styles.camera}
        />
        {/*Si scanned est true donc si un produit a été scanner, pouvoir scanner a nouveau */}
        {scanned && (
          <Button
            title={"Scanner à nouveau"}
            onPress={() => setScanned(false)}
          />
        )}
        <Text style={styles.ou}>OU</Text>
        {/* Champ de saisie pour le code-barres */}
        <TextInput
          style={styles.input}
          placeholder="Je saisis mon code-barre..."
          keyboardType="numeric"
        />
        {/* Bouton pour valider les produits */}
        <TouchableOpacity style={styles.fin}>
          <Text style={styles.buttonText}>C'est tout bon</Text>
        </TouchableOpacity>
        <Modal visible={showModal} animationType="slide">
          <View style={styles.modalContainer}>
            <Text>Produit: {product?.name}</Text>
            <TouchableOpacity onPress={showDatePicker}>
              <Text style={styles.input}>
                {dlc ? dlc.toLocaleDateString() : "Sélectionner la DLC"}
              </Text>
            </TouchableOpacity>
            <Button title="Enregistrer" onPress={saveProduct} />
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    width: 300,
    height: 350,
    borderRadius: 10,
    marginBottom: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 30,
    backgroundColor: "#B19276",
    width: 300,
    textAlign: "center",
    height: 40,
    paddingTop: 5,
    borderRadius: 10,
    marginBottom: 40,
    color: "#fff",
  },
  ou: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#E56400",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#FAF9F3",
    borderWidth: 1,
    width: "85%",
    height: "10%",
    borderRadius: 10,
    borderColor: "#A77B5A",
    padding: 10,
    marginTop: 10,
  },
  fin: {
    backgroundColor: "#FAF9F3",
    marginTop: 20,
    borderWidth: 1,
    width: "40%",
    height: "5%",
    borderRadius: 10,
    borderColor: "#A77B5A",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
  },
});
