import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';

export default function AuthScreen() {
  // États pour stocker les informations de connexion
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // États pour stocker les informations d'inscription
  const [signupEmail, setSignupEmail] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const handleSignIn = async () => {
    try {
      const response = await fetch('http://your-backend-url/users/signin', {
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
      const response = await fetch('http://your-backend-url/users/signup', {
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
      } else {
        Alert.alert('Erreur', data.error);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur de création de compte', 'Veuillez réessayer.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Conso Maestro</Text>

      {/* Champs de Connexion */}
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
        <Text style={styles.buttonText}>Connexion</Text>
      </TouchableOpacity>

      {/* Champs d'Inscription */}
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
        <Text style={styles.buttonText}>Créer mon compte</Text>
      </TouchableOpacity>

      {/* Boutons SSO (statique) */}
      <View style={styles.socialContainer}>
        <Image source={require('./assets/facebook.png')} style={styles.socialIcon} />
        <Image source={require('./assets/google.png')} style={styles.socialIcon} />
        <Image source={require('./assets/apple.png')} style={styles.socialIcon} />
      </View>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5EAD9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#E7734B',
    marginBottom: 20,
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
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
    marginTop: 30,
  },
  socialIcon: {
    width: 40,
    height: 40,
  },
});
