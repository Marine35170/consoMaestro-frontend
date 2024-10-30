import React from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal} from "react-native";
import { useState, useEffect } from "react"; // Importation de useState et useEffect pour gérer l'état et les effets
import moment from "moment"; // Utilisation de moment.js pour manipuler les dates

const PlacardScreen = () => {
  const [dlcModalVisible, setDlcModalVisible] = useState(false); // State to control Rewards modal visibility
  const navigation = useNavigation();

  const handleCongeloPress = () => {
    navigation.navigate("CongeloScreen"); // Permet d'aller vers la page Congelo
  };
  const handleFridgePress = () => {
    navigation.navigate("FridgeScreen"); // Naviguer vers la page frigo
  };
  // Fonction pour déterminer la couleur du conteneur en fonction de la date de DLC
  const handleDlcColor = (dlcDate) => {
    const today = moment(); // Date actuelle
    const expirationDate = moment(dlcDate, "DD/MM/YYYY"); // Date de limite de consommation

    const daysRemaining = expirationDate.diff(today, "days"); // Différence en jours entre la date d'aujourd'hui et la DLC

    // Logique de couleur : Rouge si la DLC est à 2 jours ou moins, Orange si entre 2 et 4 jours, Vert sinon
    if (daysRemaining <= 2) {
      return styles.redDlcContainer;
    } else if (daysRemaining <= 4) {
      return styles.orangeDlcContainer;
    } else {
      return styles.greenDlcContainer;
    }
  };
  // Fonction pour afficher la modal si la couleur de DLC est rouge ou orange
  const handleDlcPress = (dlcDate) => { // Nouvelle fonction ajoutée
    const today = moment(); // Date actuelle
    const expirationDate = moment(dlcDate, "DD/MM/YYYY"); // Date de limite de consommation

    const daysRemaining = expirationDate.diff(today, "days");

    if (daysRemaining <= 2 || (daysRemaining > 2 && daysRemaining <= 4)) { // Vérifie si la DLC est rouge ou orange
      setDlcModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/Squirrel/Heureux.png")}
        style={styles.squirrel}
      />

      <Text style={styles.PageTitle}>Mes Placards</Text>
      <View style={styles.productContainer}>
        {/* Affichage des produits */}
        <View style={styles.ProductLineContainer}>
          <Text style={styles.ProductTitle}>Produit 1</Text>

           {/* Conteneur pour la date limite de consommation avec couleur dynamique */}
          {/* Affiche la modale seulement si DLC <= à 4 jour */}
          <TouchableOpacity onPress={() => handleDlcPress("30/10/2024")}> 
          <View style={[styles.DlcContainer, handleDlcColor("30/10/2024")]}>
            <Text style={styles.DlcText}>30/10/2024</Text>
          </View>
          </TouchableOpacity>

          <View style={styles.buttonFreezer}>
            <TouchableOpacity onPress={handleCongeloPress}>
              <Image
                source={require("../assets/congelo.png")}
                style={styles.freezerLogo}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.ProductLineContainer}>
          <Text style={styles.ProductTitle}>Produit 2</Text>

          {/* Conteneur pour la date limite de consommation avec couleur dynamique */}
          <View style={[styles.DlcContainer, handleDlcColor("03/11/2024")]}>
            <Text style={styles.DlcText}>30/10/2024</Text>
          </View>

          <View style={styles.buttonFreezer}>
            <TouchableOpacity onPress={handleCongeloPress}>
              <Image
                source={require("../assets/congelo.png")}
                style={styles.freezerLogo}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.ProductLineContainer}>
          <Text style={styles.ProductTitle}>Produit 3</Text>

          {/* Conteneur pour la date limite de consommation avec couleur dynamique */}
          <View style={[styles.DlcContainer, handleDlcColor("04/11/2024")]}>
            <Text style={styles.DlcText}>30/10/2024</Text>
          </View>

          <View style={styles.buttonFreezer}>
            <TouchableOpacity onPress={handleCongeloPress}>
              <Image
                source={require("../assets/congelo.png")}
                style={styles.freezerLogo}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Boutons d'accès au congélateur */}
      <View style={styles.stocksButtonsContainer}>
        <TouchableOpacity style={styles.button} onPress={handleCongeloPress}>
          <Text style={styles.buttonText}>Mon Congélo</Text>
        </TouchableOpacity>
        {/* Boutons d'accès aux placards */}
        <TouchableOpacity style={styles.button} onPress={handleFridgePress}>
          <Text style={styles.buttonText}>Mon Frigo</Text>
        </TouchableOpacity>
      </View>
      {/* DLC courte Modal */}
      <Modal
        transparent={true}
        visible={dlcModalVisible}
        animationType="slide"
        onRequestClose={() => setDlcModalVisible(false)}
      >
        <View style={styles.modalContainer}>
        <Image
        source={require("../assets/Squirrel/Triste.png")} // Chemin de l'image de l'écureuil
        style={styles.squirrelModal}
      />
          <Text style={styles.modalTitle}>
            Oh non, ton produit va bientôt périmer, cuisine-le vite ! Ton
            porte-monnaie et la Planète te diront MERCI ! !
          </Text>
          {/* Display rewards here */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setDlcModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFE5D8",
    alignItems: "center",
    justifyContent: "center",
  },
  squirrel: {
    position: "absolute",
    width: 50,
    height: 50,
    top: 65,
    left: 30,
  },
  PageTitle: {
    color: "#E56400",
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
  },
  productContainer: {
    borderWidth: 1,
    backgroundColor: "#A77B5A",
    borderColor: "#A77B5A",
    width: "85%",
    height: "65%",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  ProductLineContainer: {
    flexDirection: "row",
    backgroundColor: "#FAF9F3",
    borderColor: "#A77B5A",
    borderWidth: 2,
    width: 170,
    height: 50,
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    alignContent: "space-between",
    marginTop: 5,
    marginBottom: 5,
  },
  ProductTitle: {
    justifyContent: "center",
    fontSize: 15,
    textAlign: "center",
    fontWeight: "bold",
    color: "#E56400",
  },
  DlcContainer: {
    justifyContent: "center",
    backgroundColor: "#FAF9F3",
    borderColor: "#A77B5A",
    borderWidth: 2,
    width: 93,
    height: 50,
    top: -11,
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginLeft: 91,
  },
  DlcText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  squirrelModal:{
    justifyContent: 'center',
    width: 95,
    height: 90,
    marginBottom: 30,
    padding: 10,
    
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 20,
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "#A77B5A",
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  buttonFreezer: {
    justifyContent: "center",
    backgroundColor: "#FAF9F3",
    borderColor: "#A77B5A",
    borderWidth: 2,
    width: 50,
    height: 50,
    top: -11,
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
  },
  freezerLogo: {
    width: 30,
    height: 30,
  },
  stocksButtonsContainer: {
    flexDirection: "row",
  },
  button: {
    justifyContent: "center",
    backgroundColor: "#FAF9F3",
    borderColor: "#A77B5A",
    borderWidth: 1,
    width: 150,
    height: 70,
    borderRadius: 10,
    padding: 10,
    marginRight: 16,
    marginLeft: 16,
    fontSize: 16,
  },
  buttonText: {
    fontWeight: "bold",
    textAlign: "center",
    color: "#E56400",
  },
   //couleurs DLC dynamiques
   redDlcContainer: {
    backgroundColor: "#FF6347", // Rouge
  },
  orangeDlcContainer: {
    backgroundColor: "#FFA500", // Orange
  },
  greenDlcContainer: {
    backgroundColor: "#32CD32", // Vert
  },
});

export default PlacardScreen;
