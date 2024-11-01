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
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Profile') iconName = 'person';
          else if (route.name === 'Menu') iconName = 'menu';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFE5D8",
    alignItems: "center",
    justifyContent: "center",
  },
  squirrel: { position: "absolute", width: 50, height: 50, top: 65, left: 30 },
  PageTitle: { color: "#E56400", fontWeight: "bold", fontSize: 20, marginBottom: 20 },
  productContainer: { borderWidth: 1, backgroundColor: "#A77B5A", borderRadius: 10, padding: 10, marginBottom: 20 },
  stocksButtonsContainer: { flexDirection: "row" },
  button: { backgroundColor: "#FAF9F3", borderColor: "#A77B5A", borderWidth: 1, width: 150, borderRadius: 10 },
  buttonText: { fontWeight: "bold", textAlign: "center", color: "#E56400" },
  // styles for DLC colors
  redDlcContainer: { backgroundColor: "#FF6347" },
  orangeDlcContainer: { backgroundColor: "#FFA500" },
  greenDlcContainer: { backgroundColor: "#69914a" },
});

export default FridgeScreen;
