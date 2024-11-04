import React from "react";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { useState, useEffect } from "react"; // Importation de useState et useEffect pour gérer l'état et les effets
import { View, Text, StyleSheet, TouchableOpacity, Image,Modal,ScrollView } from "react-native";
import moment from "moment"; // Utilisation de moment.js pour manipuler les dates
import { useSelector} from "react-redux";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

const CongeloScreen = () => {
   // Utilisation du hook de navigation pour gérer la navigation entre les écrans
   const navigation = useNavigation();
  const [shortDlcModalVisible, setShortDlcModalVisible] = useState(false); // État pour la modal de DLC courte
  const [longDlcModalVisible, setLongDlcModalVisible] = useState(false); // État pour la modal de DLC longue
  const [productsInfo, setProductsInfo] = useState(); // État pour les produits enregistrer par le user
  const userId = useSelector((state) => state.user.id);
  const isFocused = useIsFocused();
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
        // const token = await AsyncStorage.getItem("userToken"); // Récupérer le token stocké
        
        fetch(`https://conso-maestro-backend.vercel.app/congelo/${userId}`, {
            method: "GET",
            headers: {
                // Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.result) {
                console.log("data from ", data);
                setProductsInfo(data.data); // Met à jour l'état avec les infos des produits
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

  
  // Fonction pour supprimer l'affichage d'un produit
  const handleProductDelete = (data) => {
    fetch(`https://conso-maestro-backend.vercel.app/products/${data._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.result) {
        console.log("Produit supprimé avec succès :", data.message);
        setProductsInfo((prevProductsInfo) =>
          prevProductsInfo.filter(product => product._id !== data._id)
        );
        setRefresh((prev) => !prev); // Force le rafraîchissement
      } else {
        console.error("Erreur lors de la suppression du produit :", data.message);
      }
    })
    .catch((error) => {
      console.error("Erreur lors de la suppression du produit :", error);
    });
  }


  const handleFridgePress = () => {
    navigation.navigate("FridgeScreen"); // Permet d'aller vers la page Placard
  };
  const handlePlacardPress = () => {
    navigation.navigate("PlacardScreen"); // Naviguer vers la page frigo
  };

  // Fonction pour déterminer la couleur du conteneur en fonction de la date de DLC
  const handleDlcColor = (dlcDate) => {
    const today = moment(); // Date actuelle
    const expirationDate = moment(dlcDate); // Date de limite de consommation

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

  const changementStoragePlace = async (data, newStoragePlace) => {
    fetch(`https://conso-maestro-backend.vercel.app/products/${data._id}`, {
        method: "Put",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            newStoragePlace: newStoragePlace,
        }),
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.result) {
           console.log("Produit mis à jour avec succès:", data.message);
        } else {
            console.error("Erreur lors de la mise à jour du produit:", data.message);
        }
    })
}

const handleImageClick = async  (data) => {
    let newStoragePlace;
   if (data.storagePlace === "Frigo"){
    newStoragePlace = "Congelo";
  }
  else if (data.storagePlace === "Congelo"){
    newStoragePlace = "Placard";
  }
  else if (data.storagePlace === "Placard"){
    newStoragePlace = "Frigo";
};

await changementStoragePlace(data, newStoragePlace);

setProductsInfo((prevProductsInfo) =>
    prevProductsInfo.map((product) =>
      product._id === data._id
        ? { ...product, storagePlace: newStoragePlace }
        : product
    )
    );


}

   // Fonction pour gérer l'affichage des modals selon les jours restants
   const handleDlcPress = (dlcDate) => {
    const today = moment();
    const expirationDate = moment(dlcDate);
    const daysRemaining = expirationDate.diff(today, "days");

    if (daysRemaining <= 4) {
      setShortDlcModalVisible(true);
    } else {
      setLongDlcModalVisible(true);
    }
  };

  const products = productsInfo ? productsInfo.map((data, i) => {
    const formattedDlc = new Date(data.dlc).toLocaleDateString();  
  let imageSource;
  if (data.storagePlace === "Frigo"){
    imageSource = require('../assets/FRIGO.png');
  }
  else if (data.storagePlace === "Congelo"){
    imageSource = require('../assets/congelo.png');
  }
  else if (data.storagePlace === "Placard"){
    imageSource = require('../assets/Placard.png');
  }
  return ( 
    <View style={styles.ProductLineContainer} key = {i} >
          <Text style={styles.ProductTitle}>{data.name}</Text>
          
          {/* Conteneur pour la date limite de consommation avec couleur dynamique */}
          <TouchableOpacity onPress={() => handleDlcPress(data.dlc)}> 
          <View style={[styles.DlcContainer, handleDlcColor(data.dlc)]}>
            <Text style={styles.DlcText}>{formattedDlc}</Text>
          </View>
          </TouchableOpacity>

          {/* Bouton pour ajouter le produit au congélateur */}
          <View style={styles.buttonFreezer}>
            <TouchableOpacity  onPress={() => handleImageClick(data)}>
              <Image
                source={imageSource} // Icône de congélateur
                style={styles.freezerLogo}
              />
            </TouchableOpacity>
          </View>
          {/* Bouton pour supprimer un produit*/}
          <View style={styles.buttonDelete}>
                <TouchableOpacity onPress={() => handleProductDelete(data)}
                >
                  <FontAwesomeIcon
                   icon={faXmark} 
                   size={27}
                   color="#A77B5A"
                   style={styles.iconDelete}
                  />
                </TouchableOpacity>
              </View> 
        </View>
  )
}) : null;

  return (
     // Conteneur principal
    <View style={styles.container}>
      <Image
        source={require("../assets/Squirrel/Heureux.png")}
        style={styles.squirrel}
      />
       {/* Titre de la page */}  
      <Text style={styles.PageTitle}>Mon Congelo</Text>
      {/* Conteneur des produits dans le congelo */}
      <View  style={styles.productContainer}>
        {/* Affichage des produits */}
        <ScrollView Style={{ flexGrow: 1 }}>
        {products}
        </ScrollView>
      </View >

      {/* Boutons d'accès au congélateur */}
      <View style={styles.stocksButtonsContainer}>
        <TouchableOpacity style={styles.button} onPress={handleFridgePress}>
          <Text style={styles.buttonText}>Mon Frigo</Text>
        </TouchableOpacity>
        {/* Boutons d'accès aux placards */}
        <TouchableOpacity style={styles.button} onPress={handlePlacardPress}>
          <Text style={styles.buttonText}>Mes Placards</Text>
        </TouchableOpacity>
      </View>
  
      {/* DLC courte Modal */}
      <Modal
        transparent={true}
        visible={shortDlcModalVisible}
        animationType="slide"
        onRequestClose={() => setShortDlcModalVisible(false)}
      >
        <View style={styles.modalContainer}>
        <Image
        source={require("../assets/Squirrel/Triste.png")} // Chemin de l'image de l'écureuil
        style={styles.squirrelModal}
      />
          <Text style={styles.modalTitle}>
            Oh non, ton produit va bientôt périmer, cuisine-le vite ! Ton
            porte-monnaie et la Planète te diront MERCI ! 
          </Text>
          {/* Display rewards here */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShortDlcModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </Modal>
       {/* DLC Longue Modal */}
       <Modal
        transparent={true}
        visible={longDlcModalVisible}
        animationType="slide"
        onRequestClose={() => setLongDlcModalVisible(false)}
      >
        <View style={styles.modalContainer}>
        <Image
        source={require("../assets/Squirrel/Heureux.png")} // Chemin de l'image de l'écureuil
        style={styles.squirrelModal}
      />
          <Text style={styles.modalTitle}>
            Tout va bien, il te reste encore quelques temps avant que ton produit ne se périme. Privilégie les produits ayant des dates plus courtes !
          </Text>
          {/* Display rewards here */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setLongDlcModalVisible(false)}
          >
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
    backgroundColor: "#FAF9F3",
    borderColor: "#A77B5A",
    borderWidth: 1,
    width: 50,
    height: 47,
    borderRadius: 10,
    alignItems: "center",
    right: 5,
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
