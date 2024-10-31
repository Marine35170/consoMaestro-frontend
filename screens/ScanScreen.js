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
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";


export default function ScanScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [barcodeData, setBarcodeData] = useState(null);
  const [product, setProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [dlc, setDlc] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const userId = useSelector((state) => state.user.id);
  const [storagePlace, setStoragePlace] = useState("");
  const fridgeImage = require("../assets/FRIGO.png");
  const freezerImage = require("../assets/congelo.png");
  const cupboardImage = require("../assets/Placard.png");
  const navigation = useNavigation();
  const [productId, setProductId] = useState(null);
  
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
    console.log(userId);
    fetchProductData(userId, data);
  };
  {/*Recuperation de l'UPC  via la saisie */}
  const handleBarCodeWrite = () => {
    setScanned(true);
    console.log(userId);
    fetchProductData(userId, barcodeData);
  };
  {/*function pour l'etape de recherche du produit via l'UPC */}
  const fetchProductData = async (userId, data) => {
    console.log("Recherche du produit avec l'UPC : ", data);
    try {
      const response = await fetch(
        `https://conso-maestro-backend.vercel.app/products/${userId}/${data}`
      );
      const result = await response.json();
      console.log("Données récupérées : ", result);
      setProduct(result.product);
      setShowModal(true);
      setProductId(result.product._id);
      console.log(result);
    } catch (error) {
      console.error("Erreur lors de la récupération des données : ", error);
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
    if (!storagePlace) {
      Alert.alert("Erreur", "Veuillez sélectionner un lieu de stockage");
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
            _id: productId,
            storagePlace,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Succès", data.message);
        setShowModal(false);
        setBarcodeData(null);
        setProductId(null);
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

  const handleFinish = () => {
    navigation.navigate('Menu'); 
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0} 
    >
    <ImageBackground source={require('../assets/backgroundScanne.png')} style={styles.background}>
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
          value={barcodeData}
          onChangeText={setBarcodeData}
        />
        <TouchableOpacity onPress={handleBarCodeWrite} style={styles.valider}>
          <Text style={styles.buttonFinish}>Valider mon code-barre</Text>
        </TouchableOpacity>
        
        {/* Bouton pour valider les produits */}
        <TouchableOpacity style={styles.fin} onPress={handleFinish}>
          <Text style={styles.buttonFinish}>C'est tout bon</Text>
        </TouchableOpacity>
        {/* Modal pour ajouter la DLC et l'endroit ou on stocke le produit */}
        <Modal style={styles.modal} visible={showModal} animationType="slide" >
        <ImageBackground source={require('../assets/backgroundScanne.png')} style={styles.background}>
          <View style={styles.modalContainer}>
            <Text style={styles.productName}>{product?.name}</Text>
             {/* Sélecteur pour le lieu de stockage */}
            <Text style={styles.textStockage}>Choisissez votre lieu de stockage:</Text>
            <View style={styles.storageOptions}>
            {[
              { label: 'Frigo', image: fridgeImage },
              { label: 'Congelo', image: freezerImage },
              { label: 'Placard', image: cupboardImage },
            ].map((place) => (
             <TouchableOpacity
             key={place.label}
             onPress={() => setStoragePlace(place.label)}
             >
             <View style={storagePlace === place.label ? styles.selectedOptionImage : {}}>
             <Image source={place.image} style={styles.optionImage} />
             </View>
             </TouchableOpacity>
             ))}
             </View>
            <TouchableOpacity style={styles.date} onPress={showDatePicker}>
              <Text style={styles.inputDate}>
              {dlc ? dlc.toLocaleDateString() : "Sélectionner la DLC"} 
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.enregistrerButtun} onPress={saveProduct} >
              <Text style={styles.buttonText}>Enregistrer</Text>
            </TouchableOpacity>
            {/* Calendrier pour choisir la date */}
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </View>
          </ImageBackground>
        </Modal>
      </View>
    </ImageBackground>
    </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
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
    width: 300,
    textAlign: "center",
    height: 40,
    paddingTop: 5,
    borderRadius: 10,
    marginBottom: 40,
    backgroundColor: "#B19276",
    color: "#fff",
  },
  ou: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#E56400",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#FAF9F3",
    borderWidth: 1,
    width: "85%",
    height: "8%",
    borderRadius: 10,
    borderColor: "#A77B5A",
    padding: 10,
    marginTop: 10,
    color: "#B19276",
  },
  fin: {
    backgroundColor: "#69914a",
    marginTop: 20,
    borderWidth: 1,
    width: "40%",
    height: "5%",
    borderRadius: 10,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
 
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  productName: {
    fontSize: 30,
    fontWeight: "bold",
    top: -80,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#69914a",
    color: "#fff",
  },
  storageOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    marginBottom: 20,
  },
  textStockage: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  selectedOptionImage: {
    borderBottomColor: "#E56400",
    borderBottomWidth: 2,
  },
  inputDate: {   
    fontSize: 20,
    color: "#B19276",
  },
  enregistrerButtun: {
    backgroundColor: "#B19276",
    width: 150,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  optionImage: {
    width: 50,
    height: 50,
    marginTop: 10,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 20,
    color: "#FFFFFF",
  },
  date: {
    backgroundColor: "#FFFFFF",
    width: 200,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    marginTop: 50,  
  },
  buttonFinish: {
    color: "#fff",
  },
  valider: {
    backgroundColor: "#B19276",
    width: 200,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  
});
