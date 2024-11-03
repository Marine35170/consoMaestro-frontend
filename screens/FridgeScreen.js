<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal } from "react-native";
import { useSelector } from "react-redux";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from "moment";
import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';
import MenuScreen from './MenuScreen';

const Tab = createBottomTabNavigator();

const FridgeTabNavigator = () => {
  return (

    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Menu') {
            iconName = focused ? 'menu' : 'menu-outline';
          }
          // Retourne l'icône correspondante
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Menu" component={MenuScreen} />
    </Tab.Navigator>
  );
};
=======
import React from "react";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { useState, useEffect } from "react"; // Importation de useState et useEffect pour gérer l'état et les effets
import { View, Text, StyleSheet, TouchableOpacity, Image,Modal,ScrollView } from "react-native";
import moment from "moment"; // Utilisation de moment.js pour manipuler les dates
import { useSelector} from "react-redux";
>>>>>>> 55f75b19e3993ffeeffc0073f9a99bdea0f108c0

const FridgeScreen = () => {
   // Utilisation du hook de navigation pour gérer la navigation entre les écrans
  const navigation = useNavigation();
  const [shortDlcModalVisible, setShortDlcModalVisible] = useState(false); // État pour la modal de DLC courte
  const [longDlcModalVisible, setLongDlcModalVisible] = useState(false); // État pour la modal de DLC longue
  const [productsInfo, setProductsInfo] = useState(); // État pour les produits enregistrer par le user
  const userId = useSelector((state) => state.user.id);
  const isFocused = useIsFocused();

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
}, [isFocused]);

  const handlePlacardPress = () => {
    navigation.navigate("PlacardScreen"); // Permet d'aller vers la page Placard
  };
  const handleCongeloPress = () => {
    navigation.navigate("CongeloScreen"); // Naviguer vers la page congelo
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
            <TouchableOpacity onPress={() => handleDlcPress(data.dlc)}> 
            <View style={[styles.DlcContainer, handleDlcColor(data.dlc)]}>
              <Text style={styles.DlcText}>{data.dlc}</Text>
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
      <Text style={styles.PageTitle}>Mon Frigo</Text>
<<<<<<< HEAD
      <View style={styles.productContainer}>{products}</View>
=======
      {/* Conteneur des produits dans le frigo */}
      <View  style={styles.productContainer}>
        {/* Affichage des produits */}
        <ScrollView Style={{ flexGrow: 1 }}>
        {products}
        </ScrollView>
      </View >

      {/* Boutons d'accès au congélateur */}
>>>>>>> 55f75b19e3993ffeeffc0073f9a99bdea0f108c0
      <View style={styles.stocksButtonsContainer}>
        <TouchableOpacity style={styles.button} onPress={handlePlacardPress}>
          <Text style={styles.buttonText}>Mes Placards</Text>
        </TouchableOpacity>
        {/* Boutons d'accès aux placards */}
        <TouchableOpacity style={styles.button} onPress={handleCongeloPress}>
          <Text style={styles.buttonText}>Mon Congelo</Text>
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
<<<<<<< HEAD
    top: 65,
=======
    top: 50,
>>>>>>> 55f75b19e3993ffeeffc0073f9a99bdea0f108c0
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
<<<<<<< HEAD
=======
  
>>>>>>> 55f75b19e3993ffeeffc0073f9a99bdea0f108c0
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
<<<<<<< HEAD
  squirrelModal: {
=======
  squirrelModal:{
>>>>>>> 55f75b19e3993ffeeffc0073f9a99bdea0f108c0
    justifyContent: 'center',
    width: 95,
    height: 90,
    marginBottom: 30,
    padding: 10,
<<<<<<< HEAD
=======
    
>>>>>>> 55f75b19e3993ffeeffc0073f9a99bdea0f108c0
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
<<<<<<< HEAD
=======
  
>>>>>>> 55f75b19e3993ffeeffc0073f9a99bdea0f108c0
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
<<<<<<< HEAD
  // couleurs DLC dynamiques
=======
  //couleurs DLC dynamiques
>>>>>>> 55f75b19e3993ffeeffc0073f9a99bdea0f108c0
  redDlcContainer: {
    backgroundColor: "#FF6347", // Rouge
  },
  orangeDlcContainer: {
    backgroundColor: "#FFA500", // Orange
  },
  greenDlcContainer: {
    backgroundColor: "#69914a", // Vert
  },
<<<<<<< HEAD
  tabBar: {
    backgroundColor: '#EFE5D8', // Couleur de fond de la tab bar
    height: 60, // Hauteur de la tab bar
    paddingBottom: 5, // Espacement en bas
    paddingTop: 5
  },
  tabBarLabel: {
    fontSize: 12, // Taille de la police
    paddingBottom: 5, // Espacement en bas pour le texte
  },
});


=======
});



>>>>>>> 55f75b19e3993ffeeffc0073f9a99bdea0f108c0
export default FridgeScreen;
