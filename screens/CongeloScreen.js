import React, { useState, useEffect } from "react";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, ScrollView } from "react-native";
import moment from "moment";
import { useSelector } from "react-redux";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

const CongeloScreen = () => {
   // État de navigation et de rafraîchissement
   const navigation = useNavigation();
   const isFocused = useIsFocused();
   const userId = useSelector((state) => state.user.id);

   // États locaux
   const [shortDlcModalVisible, setShortDlcModalVisible] = useState(false);
   const [longDlcModalVisible, setLongDlcModalVisible] = useState(false);
   const [productsInfo, setProductsInfo] = useState();
   const [refresh, setRefresh] = useState(false);

   // Fonction pour récupérer les produits du congélateur de l'utilisateur
   useEffect(() => {
      const fetchProducts = async () => {
         fetch(`https://conso-maestro-backend.vercel.app/congelo/${userId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
         })
         .then((response) => response.json())
         .then((data) => {
            if (data.result) {
               setProductsInfo(data.data);
            } else {
               console.error("Erreur lors de la récupération des produits:", data.message);
            }
         })
         .catch((error) => {
            console.error("Erreur lors de la récupération des produits:", error);
         });
      };
      fetchProducts();
   }, [isFocused, refresh]);

   // Fonction pour supprimer un produit
   const handleProductDelete = (data) => {
      fetch(`https://conso-maestro-backend.vercel.app/products/${data._id}`, {
         method: "DELETE",
         headers: { "Content-Type": "application/json" },
      })
      .then((response) => response.json())
      .then((data) => {
         if (data.result) {
            setProductsInfo((prevProductsInfo) =>
               prevProductsInfo.filter(product => product._id !== data._id)
            );
            setRefresh((prev) => !prev);
         } else {
            console.error("Erreur lors de la suppression du produit :", data.message);
         }
      })
      .catch((error) => {
         console.error("Erreur lors de la suppression du produit :", error);
      });
   }

   // Fonctions de navigation
   const handleFridgePress = () => navigation.navigate("FridgeScreen");
   const handlePlacardPress = () => navigation.navigate("PlacardScreen");

   // Fonction pour changer l'emplacement de stockage d'un produit
   const changementStoragePlace = async (data, newStoragePlace) => {
      fetch(`https://conso-maestro-backend.vercel.app/products/${data._id}`, {
         method: "PUT",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ newStoragePlace: newStoragePlace }),
      })
      .then((response) => response.json())
      .then((data) => {
         if (data.result) {
            console.log("Produit mis à jour avec succès:", data.message);
         } else {
            console.error("Erreur lors de la mise à jour du produit:", data.message);
         }
      });
   }

   // Fonction pour gérer le clic sur l'image de stockage
   const handleImageClick = async (data) => {
      let newStoragePlace;
      if (data.storagePlace === "Frigo") newStoragePlace = "Congelo";
      else if (data.storagePlace === "Congelo") newStoragePlace = "Placard";
      else if (data.storagePlace === "Placard") newStoragePlace = "Frigo";

      await changementStoragePlace(data, newStoragePlace);
      setProductsInfo((prevProductsInfo) =>
         prevProductsInfo.map((product) =>
            product._id === data._id
               ? { ...product, storagePlace: newStoragePlace }
               : product
         )
      );
   }

   // Fonction pour gérer la couleur de la DLC
   const handleDlcColor = (dlcDate) => {
      const today = moment();
      const expirationDate = moment(dlcDate);
      const daysRemaining = expirationDate.diff(today, "days");

      if (daysRemaining <= 2) return styles.redDlcContainer;
      else if (daysRemaining <= 4) return styles.orangeDlcContainer;
      else return styles.greenDlcContainer;
   }

   // Fonction pour afficher les modals selon la durée restante avant la DLC
   const handleDlcPress = (dlcDate) => {
      const today = moment();
      const expirationDate = moment(dlcDate);
      const daysRemaining = expirationDate.diff(today, "days");

      if (daysRemaining <= 4) setShortDlcModalVisible(true);
      else setLongDlcModalVisible(true);
   };

   // Mapping des produits pour l'affichage
   const products = productsInfo ? productsInfo.map((data, i) => {
      const formattedDlc = new Date(data.dlc).toLocaleDateString();  
      let imageSource;
      let Encart;
      // Sélection de l'image en fonction de l'emplacement de stockage
      if (data.storagePlace === "Frigo") {
          imageSource = require('../assets/FRIGO.png');
          Encart = styles.buttonFrigo;
      } else if (data.storagePlace === "Congelo") {
          imageSource = require('../assets/congelo.png');
          Encart = styles.buttonFreezer;
      } else if (data.storagePlace === "Placard") {
          imageSource = require('../assets/Placard.png');
          Encart = styles.buttonPlacard;
      }
      return ( 
         <View style={styles.ProductLineContainer} key={i}>
            <Text style={styles.ProductTitle}>{data.name}</Text>
            <TouchableOpacity onPress={() => handleDlcPress(data.dlc)}> 
               <View style={[styles.DlcContainer, handleDlcColor(data.dlc)]}>
                  <Text style={styles.DlcText}>{formattedDlc}</Text>
               </View>
            </TouchableOpacity>
            <View style={Encart}>
               <TouchableOpacity onPress={() => handleImageClick(data)}>
                  <Image source={imageSource} style={styles.freezerLogo} />
               </TouchableOpacity>
            </View>
            <View style={styles.buttonDelete}>
               <TouchableOpacity onPress={() => handleProductDelete(data)}>
                  <FontAwesomeIcon icon={faXmark} size={27} color="#A77B5A" style={styles.iconDelete} />
               </TouchableOpacity>
            </View> 
         </View>
      );
   }) : null;

   // Rendu principal du composant
   return (
      <View style={styles.container}>
         <Image source={require("../assets/Squirrel/Heureux.png")} style={styles.squirrel} />
         <Text style={styles.PageTitle}>Mon Congelo</Text>
         <View style={styles.productContainer}>
            <ScrollView style={{ flexGrow: 1 }}>
               {products}
            </ScrollView>
         </View>
         <View style={styles.stocksButtonsContainer}>
            <TouchableOpacity style={styles.button} onPress={handleFridgePress}>
               <Text style={styles.buttonText}>Mon Frigo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handlePlacardPress}>
               <Text style={styles.buttonText}>Mes Placards</Text>
            </TouchableOpacity>
         </View>

         {/* Modal DLC courte */}
         <Modal transparent={true} visible={shortDlcModalVisible} animationType="slide" onRequestClose={() => setShortDlcModalVisible(false)}>
            <View style={styles.modalContainer}>
               <Image source={require("../assets/Squirrel/Triste.png")} style={styles.squirrelModal} />
               <Text style={styles.modalTitle}>Oh non, ton produit va bientôt périmer, cuisine-le vite ! Ton porte-monnaie et la Planète te diront MERCI !</Text>
               <TouchableOpacity style={styles.closeButton} onPress={() => setShortDlcModalVisible(false)}>
                  <Text style={styles.closeButtonText}>Fermer</Text>
               </TouchableOpacity>
            </View>
         </Modal>

         {/* Modal DLC longue */}
         <Modal transparent={true} visible={longDlcModalVisible} animationType="slide" onRequestClose={() => setLongDlcModalVisible(false)}>
            <View style={styles.modalContainer}>
               <Image source={require("../assets/Squirrel/Heureux.png")} style={styles.squirrelModal} />
               <Text style={styles.modalTitle}>Tout va bien, il te reste encore quelques temps avant que ton produit ne se périme. Privilégie les produits ayant des dates plus courtes !</Text>
               <TouchableOpacity style={styles.closeButton} onPress={() => setLongDlcModalVisible(false)}>
                  <Text style={styles.closeButtonText}>Fermer</Text>
               </TouchableOpacity>
            </View>
         </Modal>
      </View>
   );
};

// Styles pour les différents éléments du composant
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFE5D8", // Couleur de fond de la page
    alignItems: "center",
    justifyContent: "center",
  },
  squirrel: {
    position: "absolute",
    width: 50,
    height: 50,
    top: 50,
    left: 30,
  },
  PageTitle: {
    color: "#E56400", // Couleur du titre
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
  },
  productContainer: {
    borderWidth: 1,
    backgroundColor: "#A77B5A",
    borderColor: "#A77B5A",
    width: "85%", // Largeur relative à l'écran
    height: "65%", // Hauteur relative à l'écran
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },

  ProductLineContainer: {
    flexDirection: "row",
    justifyContent: "space-between", // Pour espacer les éléments
    backgroundColor: "#FAF9F3",
    borderColor: "#A77B5A",
    borderWidth: 2,
    width: "100%",
    height: 52,
    borderRadius: 10,
    padding: 10,
    alignItems: "center", // Centrer verticalement
    marginTop: 5,
    marginBottom: 5,
  },
  ProductTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "bold",
    color: "#E56400",
  },
  DlcButtonContainer: {
    alignItems: "center",
  },
  DlcContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 90,
    height: 47,
    borderRadius: 10,
    padding: 10,
    marginRight: 2, // Espace entre DlcContainer et buttonFreezer
    right: 10,
  },
  DlcText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  buttonFreezer: {
   justifyContent: "center",
   borderColor: "#A77B5A",
   borderWidth: 1,
   width: 50,
   height: 47,
   borderRadius: 10,
   alignItems: "center",
   right: 5,
   backgroundColor: "#0d1180",
 },
 buttonPlacard: {
     justifyContent: "center",
     borderColor: "#A77B5A",
     borderWidth: 1,
     width: 50,
     height: 47,
     borderRadius: 10,
     alignItems: "center",
     right: 5,
     backgroundColor: "#A77B5A",
   },
   buttonFrigo: {
     justifyContent: "center",
     borderColor: "#A77B5A",
     borderWidth: 1,
     width: 50,
     height: 47,
     borderRadius: 10,
     alignItems: "center",
     right: 5,
     backgroundColor: "#64d3df",
   },
 freezerLogo: {
   width: 30,
   height: 30,
 },
  iconDelete: {

  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  squirrelModal: {
    justifyContent: "center",
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
    color: "#FFF",
    fontSize: 16,
  },

  stocksButtonsContainer: {
    flexDirection: "row", // Aligne les boutons d'accès en ligne
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
    backgroundColor: "#69914a", // Vert
  },
});


export default CongeloScreen;
