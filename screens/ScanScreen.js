import React, { useState, useEffect } from "react";
import { Text, View, Button, StyleSheet, TextInput, TouchableOpacity, ImageBackground } from "react-native";
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
    <ImageBackground source={require('../assets/backgroundScanne.png')} style={styles.background}>
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
  camera: {
    width: 300,
    height: 350,
    borderRadius: 10,
    marginBottom: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 30,
    backgroundColor: "#B19276",
    width: 300,
    textAlign: "center",
    height: 40,
    paddingTop: 5,
    borderRadius: 10,
    marginBottom: 40,
    color: '#fff',
  },
  ou: {
    fontSize: 20,
    fontWeight: "bold",
    color:'#E56400',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#FAF9F3',   
    borderWidth: 1,
    width: '85%',
    height: '10%',
    borderRadius: 10,
    borderColor: '#A77B5A',
    padding: 10,
    marginTop: 10,
},
fin: {
  backgroundColor: '#FAF9F3',
  marginTop: 20,
  borderWidth: 1,
  width: '40%',
  height: '5%',
  borderRadius: 10,
  borderColor: '#A77B5A',
  textAlign: 'center',
  justifyContent: 'center',
  alignItems: 'center',
}
});
