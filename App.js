import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import MenuScreen from './screens/MenuScreen';
import { Ionicons } from '@expo/vector-icons';
<<<<<<< HEAD
import AuthScreen from './screens/AuthScreen';
import FridgeScreen from './screens/FrigoScreen';
=======
import ScanScreen from './screens/ScanScreen';import AuthScreen from './screens/AuthScreen';
>>>>>>> 0bbb05602f6f99b5ad0443c2cb6478bcc73d478c


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
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

export default function App() {
 return (
   <NavigationContainer>
     <Stack.Navigator screenOptions={{ headerShown: false }}>
       <Stack.Screen name="AuthScreen" component={AuthScreen} />
       <Stack.Screen name="TabNavigator" component={TabNavigator} />
       <Stack.Screen name="ScanScreen" component={ScanScreen} />
     </Stack.Navigator>
   </NavigationContainer>
 );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
