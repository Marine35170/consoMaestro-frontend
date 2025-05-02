import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { useSelector } from "react-redux";
import RecallPopup from "./RecallPopup";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const navigation = useNavigation();
  const username = useSelector((s) => s.user.username);
  const userId = useSelector((s) => s.user.id);
  const isFocused = useIsFocused();

  const [advices, setAdvices] = useState({ titre: "", description: "" });
  const [hasRecall, setHasRecall] = useState(false);
  const [recallProduct, setRecallProduct] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem("userToken");
      try {
        const res = await fetch(
          "https://conso-maestro-backend-eight.vercel.app/advices",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setAdvices({ titre: data.titre, description: data.description });
      } catch {}
    })();
  }, [isFocused]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `https://conso-maestro-backend-eight.vercel.app/rappels/check-recall/${userId}`
        );
        const data = await res.json();
        if (data.recalls?.length) {
          setHasRecall(true);
          setRecallProduct(data.recalls[0].noms_des_modeles_ou_references);
        } else setHasRecall(false);
      } catch {}
    })();
  }, [isFocused]);

  const togglePopup = () => setPopupVisible((v) => !v);
  const goScan = () => navigation.navigate("ScanScreen");

  return (
    <SafeAreaView style={styles.screen}>
      {/* Nouvelle ligne dynamique */}
      <View style={styles.titleRow}>
        <Text style={styles.title}>Bonjour </Text>
        <Text style={styles.titleDynamic}>{username}</Text>
      </View>

      {/* Basket */}
      <Image source={require("../assets/basket.png")} style={styles.basket} />

      {/* Scan Button */}
      <TouchableOpacity style={styles.scanBtn} onPress={goScan}>
        <Text style={styles.scanTxt}>Scanner un produit</Text>
      </TouchableOpacity>

      {/* Tips */}
      <View style={styles.tipBox}>
        <View style={styles.tipRow}>
          <Image
            source={require("../assets/idea.png")}
            style={styles.tipIcon}
          />
          <View style={styles.tipTextGroup}>
            <Text style={styles.tipTitle}>Truc & Astuce</Text>
            <Text style={styles.tipDesc}>{advices.description}</Text>
          </View>
        </View>
      </View>

      {/* Recall Popup */}
      {hasRecall && (
        <RecallPopup
          isVisible={popupVisible}
          onClose={togglePopup}
          recallProduct={recallProduct}
        />
      )}
    </SafeAreaView>
  );
}

const BTN_WIDTH = width * 0.8;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fcf6ec",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 100, // +40px pour descendre tout l'écran
    paddingHorizontal: 16,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 70, // espace au-dessus du “Bonjour User”
    marginBottom: 30, // espace sous le titre
  },
  title: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#a6c297",
    // plus de marginTop ici
  },
  titleDynamic: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#ffb64b",
    // plus de marginTop non plus
  },
  basket: {
    width: 210, // agrandi
    height: 210,
    resizeMode: "contain",
    marginBottom: 30,
  },
  scanBtn: {
    width: BTN_WIDTH,
    backgroundColor: "#eee3cc",
    borderRadius: 20, // corner radius
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 40,
  },
  scanTxt: {
    fontSize: 24,
    color: "#000000",
    
  },
  tipBox: {
    width: BTN_WIDTH,
    backgroundColor: "#FFFFFF", 
    borderRadius: 16,
    padding: 16,
    marginBottom: 40,
  },
  tipRow: {
    flexDirection: "row",
    alignItems: "center",   // on centre l'icône et le groupe de textes
  },
  tipIcon: {
    width: 60,              // ajuste selon ton visuel
    height: 60,
    marginRight: 12,        // espace entre icône et texte
  },
  tipTextGroup: {
    flex: 1,                // prend tout l'espace restant
  },
  tipTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#204825",
    marginBottom: 4,
  },
  tipDesc: {
    fontSize: 15,
    color: "#666666",
    lineHeight: 22,
  },

});
