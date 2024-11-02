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

const FridgeScreen = () => {
  const navigation = useNavigation();
  const [shortDlcModalVisible, setShortDlcModalVisible] = useState(false);
  const [longDlcModalVisible, setLongDlcModalVisible] = useState(false);
  const [productsInfo, setProductsInfo] = useState();
  const userId = useSelector((state) => state.user.id);

  useEffect(() => {
    const fetchProducts = async () => {
        fetch(`https://conso-maestro-backend.vercel.app/frigo/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.result) setProductsInfo(data.data);
            else console.error("Erreur lors de la récupération des produits:", data.message);
        })
        .catch((error) => console.error("Erreur lors de la récupération des produits:", error));
    };
    fetchProducts();
}, [navigation]);

  const handlePlacardPress = () => navigation.navigate("PlacardScreen");
  const handleCongeloPress = () => navigation.navigate("CongeloScreen");

  const handleDlcColor = (dlcDate) => {
    const today = moment();
    const expirationDate = moment(dlcDate);
    const daysRemaining = expirationDate.diff(today, "days");
    return daysRemaining <= 2 ? styles.redDlcContainer : 
           daysRemaining <= 4 ? styles.orangeDlcContainer : 
           styles.greenDlcContainer;
  };
  
  const handleDlcPress = (dlcDate) => {
    const daysRemaining = moment(dlcDate).diff(moment(), "days");
    daysRemaining <= 4 ? setShortDlcModalVisible(true) : setLongDlcModalVisible(true);
  };
  
  const products = productsInfo ? productsInfo.map((data, i) => (
    <View style={styles.ProductLineContainer} key={i}>
      <Text style={styles.ProductTitle}>{data.name}</Text>
      <View style={styles.DlcButtonContainer}>
        <TouchableOpacity onPress={() => handleDlcPress(data.dlc)}> 
          <View style={[styles.DlcContainer, handleDlcColor(data.dlc)]}>
            <Text style={styles.DlcText}>{data.dlc}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonFreezer} onPress={handleCongeloPress}>
          <Image source={require("../assets/congelo.png")} style={styles.freezerLogo} />
        </TouchableOpacity>
      </View>
    </View>
  )) : null;

  return (
    <View style={styles.container}>
      <Image source={require("../assets/Squirrel/Heureux.png")} style={styles.squirrel} />
      <Text style={styles.PageTitle}>Mon Frigo</Text>
      <View style={styles.productContainer}>{products}</View>
      <View style={styles.stocksButtonsContainer}>
        <TouchableOpacity style={styles.button} onPress={handleCongeloPress}>
          <Text style={styles.buttonText}>Mon Congélo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handlePlacardPress}>
          <Text style={styles.buttonText}>Mes Placards</Text>
        </TouchableOpacity>
      </View>
      <Modal transparent={true} visible={shortDlcModalVisible} animationType="slide"
        onRequestClose={() => setShortDlcModalVisible(false)}>
        <View style={styles.modalContainer}>
          <Image source={require("../assets/Squirrel/Triste.png")} style={styles.squirrelModal} />
          <Text style={styles.modalTitle}>
            Oh non, ton produit va bientôt périmer, cuisine-le vite !
          </Text>
          <TouchableOpacity style={styles.closeButton} onPress={() => setShortDlcModalVisible(false)}>
            <Text style={styles.closeButtonText}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal transparent={true} visible={longDlcModalVisible} animationType="slide"
        onRequestClose={() => setLongDlcModalVisible(false)}>
        <View style={styles.modalContainer}>
          <Image source={require("../assets/Squirrel/Heureux.png")} style={styles.squirrelModal} />
          <Text style={styles.modalTitle}>
            Tout va bien, il te reste encore quelques temps avant que ton produit ne se périme.
          </Text>
          <TouchableOpacity style={styles.closeButton} onPress={() => setLongDlcModalVisible(false)}>
            <Text style={styles.closeButtonText}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      {/* Footer Tab Navigator */}
      <View style={{ flex: 0.1 }}>
        <FridgeTabNavigator />
      </View>
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
  squirrelModal: {
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
  // couleurs DLC dynamiques
  redDlcContainer: {
    backgroundColor: "#FF6347", // Rouge
  },
  orangeDlcContainer: {
    backgroundColor: "#FFA500", // Orange
  },
  greenDlcContainer: {
    backgroundColor: "#69914a", // Vert
  },
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


export default FridgeScreen;
