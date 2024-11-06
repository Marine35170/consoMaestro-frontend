import React, { useState, useEffect } from "react";
import { Modal, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View, } from "react-native";
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
  const [recallProduct, setRecallProduct] = useState(null); // État pour le produit rappelé
  const [isPopupVisible, setPopupVisible] = useState(false); // État pour afficher la popup
  const [modalContent, setModalContent] = useState(""); // Pour afficher les produits concernés
  const userId = useSelector((state) => state.user.id);

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

    // pop up pour les rappels conso 

    const fetchRecalls = async () => {
      try {
        const Id = await AsyncStorage.getItem("userId");


        const response = await fetch(`https://conso-maestro-backend.vercel.app/rappels/check-recall/${userId}`);
        const data = await response.json();

        if (data && data.recalls) {
          setRecallProduct(data.recalls[0].noms_des_modeles_ou_references); // Prendre le modèle du premier produit rappelé
          setPopupVisible(true); // Affiche la popup si un rappel est trouvé
        }
      } catch (error) {
        console.error("Erreur lors de la vérification des rappels de produit :", error);
      }
    };
    // Ne charger les rappels que si l'écran est focus
    if (isFocused) {
      fetchAdvice();
      fetchRecalls();
    }

    // Si l'écran devient inactif, vous pouvez réinitialiser l'état pour éviter que l'image de rappel persiste
    return () => {
      setRecallProduct(null);
      setPopupVisible(false);
    };
  }, [isFocused]);

  // Fonction pour naviguer vers l'écran de rappel conso
  const handleRecallPress = () => {
    setModalContent(recallProduct); // Affiche les produits concernés dans la modal
    setPopupVisible(false); // Ferme la popup initiale
  };

  // Fonction pour naviguer vers l'écran de scan
  const handleScanPress = () => {
    navigation.navigate("ScanScreen"); // Navigation vers la page de scan de produit
  };

  // Fonction pour naviguer vers la page des rappels Conso
  const handleViewRecalls = () => {
    navigation.navigate("RappelConsoScreen"); // Redirige vers la page des rappels Conso
  };

  // Perme de réutiliser la pop up warning comme on veut
  useEffect(() => {
    if (isFocused) {
      setPopupVisible(false); // Réinitialise la popup à chaque fois que l'écran devient actif
      setModalContent(""); // Réinitialise le contenu de la modal
    }
  }, [isFocused]);


  return (
    <ImageBackground
      source={require("../assets/backgroundHome.png")}
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

        {/* Image d'alerte persistante */}
        {recallProduct && (
          <TouchableOpacity onPress={handleRecallPress} style={styles.alertContainer}>
            <Image
              source={require("../assets/attention.png")}
              style={styles.alertImage}
            />
          </TouchableOpacity>
        )}

        {/* Modal pour afficher les produits concernés */}
        {modalContent && (
          <Modal
            transparent={true}
            visible={true}
            animationType="slide"
            onRequestClose={() => setModalContent("")}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>Produits concernés :</Text>
                <Text style={styles.modalText}>{modalContent}</Text>

                <View style={styles.buttonRow}>
                  <TouchableOpacity style={styles.closeButton} onPress={handleViewRecalls}>
                    <Text style={styles.closeButtonText}>Rappels Conso</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.closeButton} onPress={() => setModalContent("")}>
                    <Text style={styles.closeButtonText}>Fermer</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}
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
  usernameline: {
    flexDirection: 'row',
    marginRight: 20,

  },
  colorusername: {
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
    fontFamily: "Hitchcut-Regular",
    position: "absolute",
    marginTop: 20,
    textAlign: "center",
    color: "#E56400",
    fontSize: 24,
    top: 0,
  },
  tipsMainTitle: {
    fontFamily: "Hitchcut-Regular",
    color: "#E56400",

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

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
 
  alertImage: {
    width: 60,  // Taille de l'image (ajustez selon vos besoins)
    height: 60, 
    position: 'absolute', // Position absolue pour la fixer
    bottom: 2, // Positionner l'image à 20 unités du bas de l'écran
  },

  alertContainer: {
    position: 'absolute',
    bottom: 20,  // Cette valeur définit à quel point l'image sera éloignée du bas
       justifyContent: "center",
    alignItems: "center"
  },
  modalContent: {
    backgroundColor: "#FAF9F3",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  modalText: {
    fontSize: 18,
    color: "#E56400",
    marginBottom: 10,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: 'row', // Met les éléments sur la même ligne
    justifyContent: 'center', // Espacement égal entre les boutons (ou 'center' pour les centrer)
    width: '80%', // Largeur du conteneur pour que les boutons aient un espacement équilibré
    marginTop: 20, // Espacement au-dessus
    gap: 20,
  },
  closeButton: {
    backgroundColor: "#A77B5A",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
});