import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  StyleSheet,
  Alert,
  Dimensions,
  Animated,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ScrollView,
} from "react-native";
import {
  FontAwesome,
  AntDesign,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { addUserIdToStore, addUsernameToStore } from "../reducers/userReducer";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.85;

export default function AuthScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  // --- Keyboard avoiding view and logo animation ---
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const onShow = (e) => {
      setKeyboardHeight(e.endCoordinates.height);
      Animated.timing(scaleAnim, {
        toValue: 0.6,
        duration: 300,
        useNativeDriver: true,
      }).start();
    };
    const onHide = () => {
      setKeyboardHeight(0);
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    };

    const showSub = Keyboard.addListener("keyboardDidShow", onShow);
    const hideSub = Keyboard.addListener("keyboardDidHide", onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [scaleAnim]);

  // --- Modals visibility & form state ---
  const [signupVisible, setSignupVisible] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  // --- Handlers ---
  const handleSignIn = async () => {
    const username = loginUsername.trim().toLowerCase();
    const password = loginPassword.trim();

    if (!username || !password) {
      return Alert.alert("Erreur", "Veuillez renseigner tous les champs.");
    }

    try {
      const res = await fetch(
        "https://conso-maestro-backend-eight.vercel.app/users/signin",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );
      const data = await res.json();
      console.log("returned signin data:", data);

      if (!data.result) {
        return Alert.alert("Erreur", data.error || "Identifiants invalides");
      }

      // Récupère l'ID et le username depuis la racine de data
      const userId = data.userId;
      const returnedUsername = data.username;
      const token = data.token;

      if (!userId) {
        console.error("Pas de userId dans la réponse", data);
        return Alert.alert("Erreur", "Impossible de récupérer l'utilisateur.");
      }

      // Sauvegarde en Redux
      dispatch(addUserIdToStore(userId));
      dispatch(addUsernameToStore(returnedUsername));

      // Stocke le token si présent
      if (token) {
        await AsyncStorage.setItem("userToken", token);
      }

      // Navigue vers l'app
      navigation.replace("TabNavigator");
    } catch (err) {
      console.error("Erreur handleSignIn:", err);
      Alert.alert("Erreur de connexion", "Veuillez réessayer.");
    }
  };

  const handleSignUp = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupEmail.trim())) {
      return Alert.alert("Erreur", "Email invalide");
    }
    if (signupPassword.trim().length < 5) {
      return Alert.alert("Erreur", "Mot de passe ≥ 5 caractères");
    }
    try {
      const res = await fetch(
        "https://conso-maestro-backend-eight.vercel.app/users/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: signupEmail.trim(),
            username: signupUsername.trim().toLowerCase(),
            password: signupPassword.trim(),
          }),
        }
      );
      const data = await res.json();
      if (data.result) {
        dispatch(addUserIdToStore(data.userId));
        dispatch(addUsernameToStore(data.username));
        await AsyncStorage.setItem("userToken", data.token);
        setSignupVisible(false);
        navigation.replace("TabNavigator");
      } else {
        Alert.alert("Erreur", data.error);
      }
    } catch {
      Alert.alert("Erreur d’inscription", "Veuillez réessayer.");
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      {/* Animated logo */}
      <Animated.Image
        source={require("../assets/basket.png")}
        style={[styles.logo, { transform: [{ scale: scaleAnim }] }]}
      />
      <View style={styles.titleRow}>
        <Text style={styles.title}>Panier</Text>
        
        <Text style={styles.titleTwo}>Futé</Text>
      </View>
      {/* Form card */}
      <View style={styles.card}>
        <View style={styles.inputRow}>
          <AntDesign name="mail" size={24} color="#204825" />
          <TextInput
            style={styles.input}
            placeholder="Nom d’utilisateur"
            placeholderTextColor="#888"
            keyboardType="email-address"
            value={loginUsername}
            onChangeText={setLoginUsername}
          />
        </View>
        <View
          style={[styles.inputRow, styles.inputRowLast, styles.inputMargin]}
        >
          <FontAwesome name="lock" size={24} color="#204825" />
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            placeholderTextColor="#888"
            secureTextEntry
            value={loginPassword}
            onChangeText={setLoginPassword}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.primaryBtn} onPress={handleSignIn}>
        <Text style={styles.primaryTxt}>Se connecter</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => Alert.alert("Aide", "Réinitialiser mot de passe")}
      >
        <Text style={styles.forgot}>Mot de passe oublié ?</Text>
      </TouchableOpacity>

      <View style={styles.separatorRow}>
        <View style={styles.line} />
        <Text style={styles.orTxt}>ou</Text>
        <View style={styles.line} />
      </View>

      <TouchableOpacity
        style={styles.secondaryBtn}
        onPress={() => setSignupVisible(true)}
      >
        <Text style={styles.secondaryTxt}>Créer un compte</Text>
      </TouchableOpacity>

      <Text style={styles.privacy}>Politique de confidentialité</Text>

      {/* Modal Inscription */}
      <Modal visible={signupVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          style={styles.modalBg}
          behavior={Platform.OS === "ios" ? "padding" : "position"}
          keyboardVerticalOffset={120}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalCard}>
              <ScrollView
                contentContainerStyle={styles.modalScrollContent}
                keyboardShouldPersistTaps="handled"
              >
                <Text style={styles.modalTitle}>Créer un compte</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Email"
                  placeholderTextColor="#888"
                  keyboardType="email-address"
                  value={signupEmail}
                  onChangeText={setSignupEmail}
                />
                <TextInput
                  style={[styles.modalInput, { marginTop: 12 }]}
                  placeholder="Nom d’utilisateur"
                  placeholderTextColor="#888"
                  value={signupUsername}
                  onChangeText={setSignupUsername}
                />
                <TextInput
                  style={[styles.modalInput, { marginTop: 12 }]}
                  placeholder="Mot de passe"
                  placeholderTextColor="#888"
                  secureTextEntry
                  value={signupPassword}
                  onChangeText={setSignupPassword}
                />
                <TouchableOpacity
                  style={[styles.primaryBtn, { width: "100%", marginTop: 20 }]}
                  onPress={handleSignUp}
                >
                  <Text style={styles.primaryTxt}>S'inscrire</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setSignupVisible(false)}
                  style={{ marginTop: 12, alignSelf: "center" }}
                >
                  <Text style={styles.cancel}>Annuler</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>

      {/* Footer Social */}
      <View style={styles.socialRow}>
        <TouchableOpacity style={styles.socialBtn}>
          <FontAwesome name="facebook-square" size={28} color="#4267B2" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialBtn}>
          <AntDesign name="google" size={28} color="#DB4437" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialBtn}>
          <MaterialCommunityIcons name="apple" size={28} color="#000" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FCF6EC",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 40,
  },
  logo: {
    width: 180,
    height: 180,
    resizeMode: "contain",
    marginTop: 50,
    marginBottom: 10,
  
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30, // espace sous le titre
  },
  title: {
    fontSize: 46,
    fontWeight: "bold",
    color: "#a6c297",
  },
  titleTwo: {
    fontSize: 46,
    fontWeight: "bold",
    color: "#ffb64b",
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "stretch",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderBottomWidth: 1,
    borderColor: "#DDD",
    paddingVertical: 2,
    top: "5%",
  },
  inputRowLast: {
    borderBottomWidth: 0,
  },
  inputMargin: {
    marginTop: 10,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#333",
    height: 40,
  },
  primaryBtn: {
    backgroundColor: "#EEE3CC",
    width: CARD_WIDTH,
    alignSelf: "center",
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 40,
  },
  primaryTxt: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  forgot: {
    marginTop: 12,
    color: "#666",
    fontSize: 14,
  },
  separatorRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#CCC",
  },
  orTxt: {
    marginHorizontal: 12,
    color: "#A77B5A",
    fontSize: 14,
  },
  secondaryBtn: {
    width: CARD_WIDTH,
    alignSelf: "center",
    paddingVertical: 14,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#375a33",
    alignItems: "center",
  },
  secondaryTxt: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#375a33",
  },
  privacy: {
    marginTop: 16,
    color: "#666",
    fontSize: 12,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: CARD_WIDTH * 0.6,
    marginTop: 24,
  },
  socialBtn: {
    padding: 6,
  },

  /* Modals */
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: CARD_WIDTH,
    maxHeight: "80%",
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 24,
  },
  modalScrollContent: {
    flexGrow: 0,
    justifyContent: "flex-start",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#204825",
    marginBottom: 16,
    textAlign: "center",
  },
  modalInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 12,
    padding: 12,
  },
  cancel: {
    color: "#E7734B",
    fontSize: 16,
  },
});
