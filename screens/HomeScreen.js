import React, { useState, useEffect } from "react";
import {Image,ImageBackground,StyleSheet,Text,TouchableOpacity,View,} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { useSelector } from "react-redux";

export default function HomeScreen() {
  // Hooks et état
  const navigation = useNavigation();
  const username = useSelector((state) => state.user.username); // Récupération du nom d'utilisateur depuis le store Redux
  const isFocused = useIsFocused(); // Vérifie si l'écran est en focus
  const [advicesInfo, setAdvicesInfo] = useState({
    titre: "",
    description: "",
  }); // État pour stocker les informations des conseils

  // Effet pour récupérer les conseils lorsque l'écran est en focus
  useEffect(() => {
    const fetchAdvice = async () => {
      const token = await AsyncStorage.getItem("userToken"); // Récupération du token stocké

      // Requête pour obtenir les données de conseils depuis le backend
      fetch("https://conso-maestro-backend.vercel.app/advices", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Envoi du token dans l'en-tête d'autorisation
          contentType: "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          // Mise à jour de l'état avec les informations des conseils
          setAdvicesInfo({
            titre: data.titre,
            description: data.description,
          });
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des conseils :", error);
        });
    };

    fetchAdvice(); // Appel de la fonction fetchAdvice
  }, [isFocused]);

  // Fonction pour naviguer vers l'écran de scan
  const handleScanPress = () => {
    navigation.navigate("ScanScreen"); // Navigation vers la page de scan de produit
  };

  return (
    <ImageBackground
      source={require("../assets/backgroundScanne.png")}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require("../assets/Squirrel/Heureux.png")}
            style={styles.squirrel}
          />
          <View style={styles.usernameline}>
            <Text style={styles.username}>Bonjour</Text>
            <Text style={styles.colorusername}>{username}</Text>
          </View>
        </View>

        {/* Section des trucs et astuces */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsMainTitle}>Trucs et Astuces</Text>
          <Text style={styles.tipsTitle}>{advicesInfo.titre}</Text>
          <Text style={styles.tipsText}>{advicesInfo.description}</Text>
        </View>

        {/* Bouton pour scanner un produit */}
        <TouchableOpacity style={styles.scan} onPress={handleScanPress}>
          <Text style={styles.buttonText}>Je scanne mon produit</Text>
          <Image
            source={require("../assets/scanner.png")}
            style={styles.scanImage}
          />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: "100%",
  },
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  squirrel: {
    width: 60,
    height: 60,
    top: -15,
    left: 3,
  },
  usernameline:{
  flexDirection:'row',
  marginRight: 20,

  },
  colorusername:{
    color: '#E56400',
    fontSize: 24,
    fontFamily: "Hitchcut-Regular",
    top: -3,
  },
  tipsContainer: {
    backgroundColor: "#FAF9F3",
    marginTop: 20,
    borderWidth: 1,
    padding: 5,
    paddingBottom: 20,
    borderRadius: 10,
    borderColor: "#E56400",
    width: "85%",
    height: "25%",
    overflow: "hidden",
    top: -80,
  },
  scan: {
    backgroundColor: "#FAF9F3",
    position: "relative",
    borderWidth: 1,
    width: "85%",
    height: "30%",
    borderRadius: 10,
    borderColor: "#E56400",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    overflow: "hidden",
    top: -95,
  }, 
  buttonText: {
    position: "absolute",
    marginTop: 20,
    textAlign: "center",
    color: "#E56400",
    fontWeight: "bold",
    fontSize: 24,
    top: 0,
  },
  tipsMainTitle: {
    color: "#E56400",
    fontWeight: "bold",
    fontSize: 24,
    textAlign: "center",
    marginBottom: 5,
    marginTop: 10,
  },
  tipsTitle: {
    color: "#664C25",
    marginTop: 10,
    fontSize: 20,
    textAlign: "center",
    marginBottom: 10,
  },
  tipsText: {
    color: "#B19276",
    fontSize: 15,
    textAlign: "center",
  },
  scanImage: {
    position: "absolute",
    width: 250,
    height: 300,
    top: -10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 50,
    width: "85%",
    justifyContent: "space-between",
  },
  username: {
    color: "#B19276",
    fontSize: 24,
    fontWeight: "bold",
    marginRight: 4,
  },
});
