import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
export default function ProfileScreen() {
  const navigation = useNavigation(); // Hook to navigate between screens
  const [userInfo, setUserInfo] = useState({ email: '', username: '', password: '' }); // State to store user info
  const [isRewardsModalVisible, setRewardsModalVisible] = useState(false); // State to control Rewards modal visibility
  const [isSponsorshipsModalVisible, setSponsorshipsModalVisible] = useState(false); // State to control Sponsorships modal visibility

  // useEffect hook to fetch user data when the component loads
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = await AsyncStorage.getItem('userToken'); // Retrieve the stored token

      // Fetch user data from the backend
      fetch('https://conso-maestro-backend.vercel.app/users/profile', {
        headers: { Authorization: `Bearer ${token}` }, // Send token in Authorization header
      })
        .then((response) => response.json())
        .then((data) => {
          // Update state with user info if response is successful
          setUserInfo({
            email: data.email || 'Non disponible',
            username: data.username || 'Non disponible',
            password: data.password ? '********' : 'Non disponible',
          });
        })
    };

    fetchUserInfo(); // Calls fetchUserInfo function
  }, []);

  // Function to handle user sign-out
  const handleSignOut = async () => {
    await AsyncStorage.removeItem('userToken'); // Clear token from local storage
    navigation.navigate('AuthScreen'); // Navigate to Auth screen
  };

  return (
    <ImageBackground source={require('../assets/backgroundProfile.png')} style={styles.background}>
      <View style={styles.container}>
        
        {/* Personal Information Section */}
        <View style={styles.infoContainer}>
          <Text style={styles.sectionTitle}>Mes informations personnelles</Text>
          <Text style={styles.infoText}>e-mail: {userInfo.email}</Text>
          <Text style={styles.infoText}>Nom d'utilisateur: {userInfo.username}</Text>
          <Text style={styles.infoText}>Mot de passe: {userInfo.password}</Text>
        </View>

        {/* Additional Options Section */}
        <View style={styles.optionsContainer}>
          <Text style={styles.sectionTitle}>Options supplémentaires</Text>

          <TouchableOpacity style={styles.optionButton} onPress={() => setRewardsModalVisible(true)}>
            <Text style={styles.optionButtonText}>Mes Récompenses</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionButton} onPress={() => setSponsorshipsModalVisible(true)}>
            <Text style={styles.optionButtonText}>Mes Parrainages</Text>
          </TouchableOpacity>
        </View>

        {/* Rewards Modal */}
        <Modal
          transparent={true}
          visible={isRewardsModalVisible}
          animationType="slide"
          onRequestClose={() => setRewardsModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Mes Récompenses</Text>
            {/* Display rewards here */}
            <TouchableOpacity style={styles.closeButton} onPress={() => setRewardsModalVisible(false)}>
              <Text style={styles.closeButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* Sponsorships Modal */}
        <Modal
          transparent={true}
          visible={isSponsorshipsModalVisible}
          animationType="slide"
          onRequestClose={() => setSponsorshipsModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Mes Parrainages</Text>
            {/* Display sponsorships here */}
            <TouchableOpacity style={styles.closeButton} onPress={() => setSponsorshipsModalVisible(false)}>
              <Text style={styles.closeButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutButtonText}>Déconnexion</Text>
          <Ionicons name="leaf-outline" size={18} color="#FFF" style={styles.icon} /> 
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
    background: {
      flex: 1,
    },
    container: {
      flex: 1,
      paddingHorizontal: 20,
      paddingVertical: 40,
    },
    infoContainer: {
      backgroundColor: '#E0E0E0',
      padding: 20,
      borderRadius: 10,
      marginBottom: 20,
      marginTop: 116, 
    },
    optionsContainer: {
      backgroundColor: '#E0E0E0',
      padding: 20,
      borderRadius: 10,
      marginBottom: 20,
      marginTop: 60, 
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    infoText: {
      fontSize: 16,
      marginBottom: 5,
    },
    optionButton: {
      backgroundColor: '#A77B5A',
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 10,
      marginVertical: 5,
    },
    optionButtonText: {
      color: '#FFF',
      fontSize: 16,
      textAlign: 'center',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      padding: 20,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#FFF',
      marginBottom: 20,
    },
    closeButton: {
      backgroundColor: '#A77B5A',
      padding: 10,
      borderRadius: 10,
      marginTop: 20,
    },
    closeButtonText: {
      color: '#FFF',
      fontSize: 16,
    },
    signOutButton: {
      flexDirection: 'row', 
      backgroundColor: '#FF4C4C',
      paddingVertical: 7, 
      paddingHorizontal: 5,
      borderRadius: 10,
      alignItems: 'center', 
      justifyContent: 'center', 
      marginTop: 72, 
    },
    signOutButtonText: {
      color: '#FFF',
      fontSize: 16, 
      fontWeight: 'bold',
      marginRight: 18, 
    },
  });
  