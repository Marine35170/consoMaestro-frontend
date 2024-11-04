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
import { useNavigation , useIsFocused } from "@react-navigation/native";
import { useSelector } from "react-redux";

export default function HomeScreen({}) {
 const navigation = useNavigation();
 const username = useSelector((state) => state.user.username);
 const isFocused = useIsFocused();
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
  }, [isFocused]);

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

        {/* Trucs et astuces */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsMainTitle}>Trucs et Astuces</Text>
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
    
  },
  usernameline:{
flexDirection:'row',

  },
  colorusername:{
    color: '#E56400',
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
  },
});
