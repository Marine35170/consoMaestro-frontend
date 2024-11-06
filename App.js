import { NavigationContainer } from '@react-navigation/native'; // Importation de la bibliothèque de navigation
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // Création d'une navigation par pile
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // Création d'une navigation par onglets
import HomeScreen from './screens/HomeScreen'; // Importation des écrans
import ProfileScreen from './screens/ProfileScreen';
import MenuScreen from './screens/MenuScreen';
import { Ionicons } from '@expo/vector-icons'; // Importation des icônes Ionicons
import ScanScreen from './screens/ScanScreen';
import AuthScreen from './screens/AuthScreen';
import QuickConsoScreen from './screens/QuickconsoScreen';
import InventaireScreen from './screens/InventaireScreen';
import CongeloScreen from './screens/CongeloScreen';
import PlacardScreen from './screens/PlacardScreen';
import RecipesScreen from './screens/RecipesScreen';
import RappelConsoScreen from './screens/RappelconsoScreen';
import { Provider } from 'react-redux'; // Importation de Redux pour la gestion d'état
import { configureStore } from '@reduxjs/toolkit'; // Configuration du store Redux
import userReducer from './reducers/userReducer'; // Réducteur pour la gestion de l'utilisateur
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUtensils } from '@fortawesome/free-solid-svg-icons';


const Stack = createNativeStackNavigator(); // Création de la pile de navigation
const Tab = createBottomTabNavigator(); // Création de la navigation par onglets

// Configuration du store Redux
const store = configureStore({
  reducer: {
    user: userReducer, // Gestion de l'état utilisateur
  },
});

// Configuration de la navigation par onglets
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // Masque l'en-tête par défaut
        tabBarShowLabel: false, // Masque les libellés des onglets
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          // Définition des icônes pour chaque onglet
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Menu') {
            return <FontAwesomeIcon icon={faUtensils} size={size} color={color} />;
          }

          // Retourne l'icône correspondante
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#664C25', // Couleur de l'icône active
        tabBarInactiveTintColor: '#FFF', // Couleur de l'icône inactive
        tabBarStyle: {
          backgroundColor: '#A77B5A', // Couleur de fond de la barre de navigation
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen}/>
      <Tab.Screen name="Menu" component={MenuScreen}/>
      {/* Écrans cachés dans la barre de navigation */}
      <Tab.Screen
        name="InventaireScreen"
        component={InventaireScreen}
        options={{ tabBarButton: () => null }} // Ne pas afficher ce tab
      />
      <Tab.Screen
        name="CongeloScreen"
        component={CongeloScreen}
        options={{ tabBarButton: () => null }} // Ne pas afficher ce tab
      />
      <Tab.Screen
        name="PlacardScreen"
        component={PlacardScreen}
        options={{ tabBarButton: () => null }} // Ne pas afficher ce tab
      
      />
       <Tab.Screen
        name="RecipesScreen"
        component={RecipesScreen}
        options={{ tabBarButton: () => null }}
      
      />
      <Stack.Screen 
      name="QuickConsoScreen" 
      component={QuickConsoScreen} 
      options={{ tabBarButton: () => null }} // Ne pas afficher ce tab
      />
    </Tab.Navigator>
  );
};

// Fonction principale de l'application
export default function App() {
 return (
  <Provider store={store}> 
   <NavigationContainer> 
     <Stack.Navigator screenOptions={{ headerShown: false }}> 
       <Stack.Screen name="AuthScreen" component={AuthScreen} />
       <Stack.Screen name="TabNavigator" component={TabNavigator} />
       <Stack.Screen name="ScanScreen" component={ScanScreen} />
       <Stack.Screen name="RappelConsoScreen" component={RappelConsoScreen} />
     </Stack.Navigator>
   </NavigationContainer>
   </Provider>
 );
}