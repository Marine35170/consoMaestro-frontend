// App.js
import React, { useEffect } from "react";
import { LogBox } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import HomeScreen from "./screens/HomeScreen";
import MenuScreen from "./screens/MenuScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ScanScreen from "./screens/ScanScreen";
import AuthScreen from "./screens/AuthScreen";
import QuickConsoScreen from "./screens/QuickconsoScreen";
import InventaireScreen from "./screens/InventaireScreen";
import RecipesScreen from "./screens/RecipesScreen";
import RappelConsoScreen from "./screens/RappelconsoScreen";

import userReducer from "./reducers/userReducer";

LogBox.ignoreAllLogs();

// On ne prévient plus ici la cache du splash, on gérera ça après le chargement des fonts
// SplashScreen.preventAutoHideAsync();

const store = configureStore({
  reducer: { user: userReducer },
});

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIcon: ({ focused, color, size }) => {
          let name;
          if (route.name === "Home")
            name = focused ? "barcode" : "barcode-outline";
          if (route.name === "Menu")
            name = focused ? "restaurant" : "restaurant-outline";
          if (route.name === "Profile")
            name = focused ? "person" : "person-outline";
          return <Ionicons name={name} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#feb54a",
        tabBarInactiveTintColor: "#afa399",
        tabBarItemStyle: { paddingTop: 8 },
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 70,
          backgroundColor: "rgba(255,255,255,0.95)",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          overflow: "visible",
          elevation: 5,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: -3 },
          shadowRadius: 5,
          paddingBottom: 15,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Menu" component={MenuScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />

      {/* écrans cachés */}
      <Tab.Screen
        name="InventaireScreen"
        component={InventaireScreen}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="RecipesScreen"
        component={RecipesScreen}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="QuickConsoScreen"
        component={QuickConsoScreen}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="RappelConsoScreen"
        component={RappelConsoScreen}
        options={{ tabBarButton: () => null }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  // 1️⃣ On appelle useFonts DANS le corps du composant
  const [fontsLoaded, fontError] = useFonts({
    // si vous n'utilisez plus "Hitchcut", laissez l'objet vide
    // ou chargez d'autres polices ici
    // e.g. "OpenSans-Regular": require("./assets/fonts/OpenSans-Regular.ttf"),
  });

  // 2️⃣ On cache le splash screen dès que les fonts sont chargées (ou en erreur)
  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // 3️⃣ Tant que le chargement des polices n'est pas terminé, on ne rend rien
  if (!fontsLoaded && !fontError) {
    return null;
  }

  // 4️⃣ En cas d'erreur de chargement de police, on log simplement
  if (fontError) {
    console.error("Error loading fonts:", fontError);
    // Vous pouvez choisir de rendre un fallback ici
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="AuthScreen" component={AuthScreen} />
            <Stack.Screen name="TabNavigator" component={TabNavigator} />
            <Stack.Screen name="ScanScreen" component={ScanScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </GestureHandlerRootView>
  );
}
