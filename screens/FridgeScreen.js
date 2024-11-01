import { useNavigation } from "@react-navigation/native"; // Importation du hook de navigation pour naviguer entre les écrans
import {View,Text,StyleSheet,TouchableOpacity,Image,Modal,} from "react-native"; // Import des composants nécessaires de React Native
import { useState, useEffect } from "react"; // Importation de useState et useEffect pour gérer l'état et les effets
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from "moment"; // Utilisation de moment.js pour manipuler les dates
import { useSelector } from "react-redux";

const FridgeScreen = () => {
  // Utilisation du hook de navigation pour gérer la navigation entre les écrans
  const navigation = useNavigation();
  const [shortDlcModalVisible, setShortDlcModalVisible] = useState(false); // État pour la modal de DLC courte
  const [longDlcModalVisible, setLongDlcModalVisible] = useState(false); // État pour la modal de DLC longue
  const [productsInfo, setProductsInfo] = useState(); // État pour les produits enregistrer par le user
  const userId = useSelector((state) => state.user.id);

  useEffect(() => {
    const fetchProducts = async () => {
        // const token = await AsyncStorage.getItem("userToken"); // Récupérer le token stocké
        
        fetch(`https://conso-maestro-backend.vercel.app/frigo/${userId}`, {
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
}, [navigation]);

  // Fonction pour naviguer vers l'écran PlacardScreen
  const handlePlacardPress = () => {
    navigation.navigate("PlacardScreen"); 
  };

  // Fonction pour naviguer vers l'écran CongeloScreen
  const handleCongeloPress = () => {
    navigation.navigate("CongeloScreen");
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
  console.log('productsInfo', productsInfo)
  return ( 
    <View style={styles.ProductLineContainer} key = {i} >
          <Text style={styles.ProductTitle}>{data.name}</Text>
          
          {/* Conteneur pour la date limite de consommation avec couleur dynamique */}
          <View style={styles.DlcButtonContainer}>
          <TouchableOpacity onPress={() => handleDlcPress(data.dlc)}> 
          <View style={[styles.DlcContainer, handleDlcColor(data.dlc)]}>
            <Text style={styles.DlcText}>{data.dlc}</Text>
          </View>
          </TouchableOpacity>

          {/* Bouton pour ajouter le produit au congélateur */}
            <TouchableOpacity style={styles.buttonFreezer} onPress={handleCongeloPress}>
              <Image
                source={require("../assets/congelo.png")} // Icône de congélateur
                style={styles.freezerLogo}
              />
            </TouchableOpacity>
          </View>
        </View>
  )
}) : null;

  return (
    // Conteneur principal
    <View style={styles.container}>
      {/* Image d'un écureuil, positionnée en haut à gauche */}
      <Image
        source={require("../assets/Squirrel/Heureux.png")} // Chemin de l'image de l'écureuil
        style={styles.squirrel}
      />

      {/* Titre de la page */}
      <Text style={styles.PageTitle}>Mon Frigo</Text>

      {/* Conteneur des produits dans le frigo */}
      <View style={styles.productContainer}>
        {/* Affichage des produits */}
        {products}
      </View>

      {/* Boutons d'accès au congélateur et au placard */}
      <View style={styles.stocksButtonsContainer}>
        <TouchableOpacity style={styles.button} onPress={handleCongeloPress}>
          <Text style={styles.buttonText}>Mon Congélo</Text>
        </TouchableOpacity>

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
    top: 65,
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
    width: '100%',
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
    flexDirection: "row", // Aligne les deux éléments horizontalement
    alignItems: "center",
  },
  DlcContainer: {
    justifyContent: "center",
    width: 94,
    height: 47,
    borderRadius: 10,
    padding: 10,
    marginRight: 2, // Espace entre DlcContainer et buttonFreezer
    right: -7,
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
    right: -7,
  },
  freezerLogo: {
    width: 30,
    height: 30,
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

export default FridgeScreen; // Exporte le composant pour pouvoir être utilisé dans d'autres parties de l'application
