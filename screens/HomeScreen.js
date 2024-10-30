import React, { useState, useEffect } from "react";
import react from "react";
import {
  Button,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen({ navigation }) {
  const navigation = useNavigation(); // Hook to navigate between screens
  const [advicesInfo, setAdvicesInfo] = useState({
    titre: "",
    description: "",
  }); // State to store advice info

  useEffect(() => {
    const fetchAdvice = async () => {
      const token = await AsyncStorage.getItem("userToken"); // Retrieve the stored token

      // Fetch advice data from the backend
      fetch("https://conso-maestro-backend.vercel.app/advices", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          contentType: "application/json",
        }, // Send token in Authorization header
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("data from fetch", data);
          // Update state with user info if response is successful
          setAdvicesInfo({
            titre: data.titre,
            description: data.description,
          });
        })
        .catch((error) => {
          console.error(error);
        });
    };
    fetchAdvice(); // Calls fetchAdvice function
  }, []);

  const handleScanPress = () => {
    {
      /* Naviguer vers la page de scan de produit*/
    }
    navigation.navigate("ScanScreen");
  };

  return (
    <ImageBackground
      source={require("../assets/backgroundScanne.png")}
      style={styles.background}
    >
      <View style={styles.container}>
        <Image
          source={require("../assets/Squirrel/Heureux.png")}
          style={styles.squirrel}
        />

        {/* Trucs et astuces */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>Trucs et Astuces</Text>
          <Text style={styles.tipsTitle}>{advicesInfo.titre}</Text>
          <Text style={styles.tipsText}>
          {advicesInfo.description}
          </Text>
        </View>
        <TouchableOpacity style={styles.scan} onPress={handleScanPress}>
          <Text style={styles.buttonText}>Je scanne mon produit</Text>
          <Image
            source={require("../assets/scanner.png")}
            style={styles.scanImage}
          />
        </TouchableOpacity>
        <Text style={styles.ou}>OU</Text>
        {/* Champ de saisie pour le code-barres */}
        <TextInput
          style={styles.input}
          placeholder="Je saisis mon code-barre..."
          keyboardType="numeric"
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  squirrel: {
    width: 60,
    height: 60,
    marginBottom: 10,
    marginRight: 250,
    marginTop: -55,
  },
  tipsContainer: {
    backgroundColor: "#FAF9F3",
    marginTop: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    borderColor: "#A77B5A",
    width: "85%",
    height: "25%",
    marginBottom: 20,
    overflow: "hidden",
  },
  scan: {
    backgroundColor: "#FAF9F3",
    position: "relative",
    borderWidth: 1,
    width: "85%",
    height: "25%",
    borderRadius: 10,
    borderColor: "#A77B5A",
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    overflow: "hidden",
  },
  ou: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#E56400",
    marginTop: 10,
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
  },
  buttonText: {
    color: "#664C25",
    position: "absolute",
    marginTop: 20,
    textAlign: "center",
    fontSize: 20,
    top: 0,
  },
  tipsTitle: {
    color: "#664C25",
    marginTop: 10,
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
  },
  tipsText: {
    color: "#B19276",
    fontSize: 15,
    textAlign: "center",
  },
  scanImage: {
    position: "absolute",
    width: 250,
    height: 250,
    top: 0,
  },
});
