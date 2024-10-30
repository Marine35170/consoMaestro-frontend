import { useNavigation } from "@react-navigation/native"; // Importation du hook de navigation pour naviguer entre les écrans
import {View,Text,StyleSheet,TouchableOpacity,Image,Modal,} from "react-native"; // Import des composants nécessaires de React Native
import { useState, useEffect } from "react"; // Importation de useState et useEffect pour gérer l'état et les effets
import moment from "moment"; // Utilisation de moment.js pour manipuler les dates

const FridgeScreen = () => {
  const [shortDlcModalVisible, setShortDlcModalVisible] = useState(false); // État pour la modal de DLC courte
  const [longDlcModalVisible, setLongDlcModalVisible] = useState(false); // État pour la modal de DLC longue

 
  // Utilisation du hook de navigation pour gérer la navigation entre les écrans
  const navigation = useNavigation();

  // Fonction pour naviguer vers l'écran PlacardScreen
  const handlePlacardPress = () => {
    navigation.navigate("PlacardScreen"); // Navigue vers la page "Placard"
  };

  // Fonction pour naviguer vers l'écran CongeloScreen
  const handleCongeloPress = () => {
    navigation.navigate("CongeloScreen"); // Navigue vers la page "Congélateur"
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
    // Fonction pour gérer l'affichage des modals selon les jours restants
  const handleDlcPress = (dlcDate) => {
    const today = moment();
    const expirationDate = moment(dlcDate, "DD/MM/YYYY");
    const daysRemaining = expirationDate.diff(today, "days");

    if (daysRemaining <= 4) {
      setShortDlcModalVisible(true);
    } else {
      setLongDlcModalVisible(true);
    }
  };
  
  

   
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
        {/* Affichage de la ligne pour le produit 1 */}
        <View style={styles.ProductLineContainer}>
          <Text style={styles.ProductTitle}>Produit 1</Text>
          
          {/* Conteneur pour la date limite de consommation avec couleur dynamique */}
          <TouchableOpacity onPress={() => handleDlcPress("30/11/2024")}> 
          <View style={[styles.DlcContainer, handleDlcColor("30/11/2024")]}>
            <Text style={styles.DlcText}>30/10/2024</Text>
          </View>
          </TouchableOpacity>

          {/* Bouton pour ajouter le produit au congélateur */}
          <View style={styles.buttonFreezer}>
            <TouchableOpacity onPress={handleCongeloPress}>
              <Image
                source={require("../assets/congelo.png")} // Icône de congélateur
                style={styles.freezerLogo}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Affichage de la ligne pour le produit 2 */}
        <View style={styles.ProductLineContainer}>
          <Text style={styles.ProductTitle}>Produit 2</Text>

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

        {/* Affichage de la ligne pour le produit 3 */}
        <View style={styles.ProductLineContainer}>
          <Text style={styles.ProductTitle}>Produit 3</Text>

          <View style={[styles.DlcContainer, handleDlcColor("30/10/2024")]}>
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
    flexDirection: "row", // Disposition en ligne pour aligner les éléments
    backgroundColor: "#FAF9F3",
    borderColor: "#A77B5A",
    borderWidth: 2,
    width: 170,
    height: 50,
    borderRadius: 10,
    padding: 10,
    alignContent: "space-between",
    marginTop: 5,
    marginBottom: 5,
  },
  ProductTitle: {
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
  },
  freezerLogo: {
    width: 30,
    height: 30,
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
    backgroundColor: "#32CD32", // Vert
  },
});

export default FridgeScreen; // Exporte le composant pour pouvoir être utilisé dans d'autres parties de l'application
