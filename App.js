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
SplashScreen.preventAutoHideAsync();

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
          if (route.name === "Home") {
            name = focused ? "barcode" : "barcode-outline";
          } else if (route.name === "Menu") {
            name = focused ? "restaurant" : "restaurant-outline";
          } else if (route.name === "Profile") {
            name = focused ? "person" : "person-outline";
          }
          return <Ionicons name={name} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#feb54a",
        tabBarInactiveTintColor: "#afa399",
        tabBarItemStyle: {
          paddingTop: 10,    // remonte un peu l’icône
        },
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 70,           // laisse de la place au safe area
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          overflow: 'visible',           // pour ne pas couper les icônes
          elevation: 5,                  // Android shadow
          shadowColor: '#000',           // iOS shadow
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: -3 },
        shadowRadius: 5,    // ← on remonte un peu tout le contenu
        paddingBottom: 15, 
        },
        tabBarItemStyle: {
          paddingTop: 8,     
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
  const [loaded, error] = useFonts({
    "Hitchcut-Regular": require("./assets/fonts/Hitchcut-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="AuthScreen" component={AuthScreen} />
          <Stack.Screen name="TabNavigator" component={TabNavigator} />
          <Stack.Screen name="ScanScreen" component={ScanScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
