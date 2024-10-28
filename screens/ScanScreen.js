import React, { useState, useEffect } from "react";
import { Text, View, Button, StyleSheet, TextInput, TouchableOpacity  } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";

export default function ScanScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [barcodeData, setBarcodeData] = useState(null);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };
    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setBarcodeData(data);
    alert(`Votre produit a bien été scanner: ${data}`);
  };

  if (hasPermission === null) {
    return <Text>Demande de permission de la caméra...</Text>;
  }
  if (hasPermission === false) {
    return <Text>Pas d'accès à la caméra</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style= {styles.text}>Scannez votre produit</Text>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={styles.camera}
      />
      {scanned && (
        <Button title={"Scanner à nouveau"} onPress={() => setScanned(false)} />
      )}
      <Text style={styles.ou}>OU</Text>
      <TextInput
        style={styles.input}
        placeholder="Je saisis mon code-barre..."
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.fin} >
        <Text style={styles.buttonText}>C'est tout bon</Text>
      </TouchableOpacity>
    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 50,
    backgroundColor: "#EFE5D8",
  },
  camera: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    backgroundColor: "#B19276",
    width: 300,
    textAlign: "center",
    height: 40,
    paddingTop: 5,
    borderRadius: 10,
    marginBottom: 40,
    color: "#EFE5D8",
  },
  ou: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  input: {
       
    borderWidth: 1,
    width: '85%',
    height: '10%',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
},
fin: {
  marginTop: 50,
  borderWidth: 1,
  width: '40%',
  height: '5%',
  borderRadius: 10,
  textAlign: 'center',
  justifyContent: 'center',
  alignItems: 'center',
}
});
