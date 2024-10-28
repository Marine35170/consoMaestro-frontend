import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Modal, Alert, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
const navigation = useNavigation();

export default function AuthScreen() {
  // États pour gérer la modale de connexion et d'inscription
  const [isLoginModalVisible, setLoginModalVisible] = useState(false);
  const [isSignupModalVisible, setSignupModalVisible] = useState(false);

  // États pour stocker les informations de connexion
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // États pour stocker les informations d'inscription
  const [signupEmail, setSignupEmail] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const handleSignIn = async () => {
    try {
      const response = await fetch('https://conso-maestro-backend.vercel.app//users/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: loginUsername,
          password: loginPassword,
        }),
      });
      const data = await response.json();
      if (data.result) {
        Alert.alert('Connexion réussie !', data.message);
        setLoginModalVisible(false); // Fermer la modale après connexion
        navigation.navigate('HomeScreen'); // Rediriger vers la page d'accueil
      } else {
        Alert.alert('Erreur', data.error);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur de connexion', 'Veuillez réessayer.');
    }
  };

  const handleSignUp = async () => {
    try {
      const response = await fetch('https://conso-maestro-backend.vercel.app//users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: signupEmail,
          username: signupUsername,
          password: signupPassword,
        }),
      });
      const data = await response.json();
      if (data.result) {
        Alert.alert('Succès', data.message);
        setSignupModalVisible(false); // Fermer la modale après inscription
      } else {
        Alert.alert('Erreur', data.error);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur de création de compte', 'Veuillez réessayer.');
    }
  };

  return (
    <ImageBackground source={require('../assets/backgroundAuth.png')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Conso Maestro</Text>

        <View style={styles.buttonContainer}>
          {/* Bouton Connexion */}
          <TouchableOpacity style={styles.button} onPress={() => setLoginModalVisible(true)}>
            <Text style={styles.buttonText}>Connexion</Text>
          </TouchableOpacity>

          {/* Bouton Inscription */}
          <TouchableOpacity style={styles.button} onPress={() => setSignupModalVisible(true)}>
            <Text style={styles.buttonText}>Créer mon compte</Text>
          </TouchableOpacity>
        </View>

        {/* Modale de Connexion */}
        <Modal visible={isLoginModalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Connexion</Text>
              <TextInput
                style={styles.input}
                placeholder="Nom d'utilisateur"
                value={loginUsername}
                onChangeText={setLoginUsername}
              />
              <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                value={loginPassword}
                onChangeText={setLoginPassword}
                secureTextEntry
              />
              <TouchableOpacity style={styles.button} onPress={handleSignIn}>
                <Text style={styles.buttonText}>Se connecter</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setLoginModalVisible(false)}>
                <Text style={styles.cancelText}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modale d'Inscription */}
        <Modal visible={isSignupModalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Créer un compte</Text>
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={signupEmail}
                onChangeText={setSignupEmail}
                keyboardType="email-address"
              />
              <TextInput
                style={styles.input}
                placeholder="Nom d'utilisateur"
                value={signupUsername}
                onChangeText={setSignupUsername}
              />
              <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                value={signupPassword}
                onChangeText={setSignupPassword}
                secureTextEntry
              />
              <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>S'inscrire</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSignupModalVisible(false)}>
                <Text style={styles.cancelText}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Boutons SSO */}
        <View style={styles.socialContainer}>
          <Image source={require('../assets/facebook.png')} style={styles.socialIcon} />
          <Image source={require('../assets/google.png')} style={styles.socialIcon} />
          <Image source={require('../assets/apple.png')} style={styles.socialIcon} />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#E7734B',
    marginBottom: 20,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 150, 
    alignItems: 'center',
    width: '100%',
  },
  input: {
    width: '80%',
    padding: 10,
    marginVertical: 5,
    borderColor: '#A77B5A',
    borderWidth: 1,
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#A77B5A',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
    marginVertical: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E7734B',
    marginBottom: 10,
  },
  cancelText: {
    color: '#E7734B',
    fontSize: 16,
    marginTop: 10,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
    position: 'absolute',
    bottom: 80, 
  },
  socialIcon: {
    width: 40,
    height: 40,
  },
});