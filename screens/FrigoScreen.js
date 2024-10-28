import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

const FridgeScreen = () => {
  return (
    <View style={styles.container}>
        <Image source={require('../assets/Squirrel/Heureux.png')} style={styles.squirrel}/>

      <Text style={styles.PageTitle}>Contenu de mon Frigo</Text>
      <View style={styles.productContainer}>
        {/* Affichage des produits */}
        <Text style={styles.ProductTitle}>Produit 1</Text>
        <Text style={styles.DLCDate}>DLC</Text>
        <Image source={require("../assets/FRIGO")} style={styles.frigoLogo} />
        
        <Text style={styles.ProductTitle}>Produit 2</Text>
        <Text style={styles.DLCDate}>DLC</Text>
        <Image source={require("../assets/FRIGO")} style={styles.frigoLogo} />

        <Text style={styles.ProductTitle}>Produit 3</Text>
        <Text style={styles.DLCDate}>DLC</Text>
        <TouchableOpacity style={styles.scan} onPress={handleScanPress}>
          <Image source={require("../assets/FRIGO")} style={styles.frigoLogo} />
        </TouchableOpacity>
      </View>
      {/* Boutons d'accès congélateur et placards */}
      <View style={styles.stockButtonsContainer}>
      <TouchableOpacity style={styles.scan} onPress={handleScanPress}>
                <Text style={styles.buttonText}>Mon Congélo</Text>
                <Image source={require('../assets/scanner.png')} style={styles.scanImage}/>
        </TouchableOpacity>

        <TouchableOpacity style={styles.scan} onPress={handleScanPress}>
                <Text style={styles.buttonText}>Mes Placards</Text>
                <Image source={require('../assets/scanner.png')} style={styles.scanImage}/>
        </TouchableOpacity>

      </View>

    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EFE5D8',
        alignItems: 'center',
        justifyContent: 'center',
    },
    squirrel: {
       
        width: 60,
        height: 60,
        marginBottom: 10,
        marginRight: 250,
        marginTop: -55,
    },
    tipsTitle: {
       
        borderWidth: 1,
        width: '85%',
        height: '10%',
        borderRadius: 10,
        padding: 10,
    },
    ProductTitle: {
        position: 'absolute',
       marginTop: 20,
        textAlign: 'center',
        color: 'black',
        fontSize: 20,
        top: 0,
        
    },
    tipsTitle: {
        marginTop: 10,
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 20,
    },
    tipsText: {
        fontSize: 15,
        textAlign: 'center',
    },
    scanImage: {
        position: 'absolute',
        width: 250,
        height: 250,
        top: 0,
        
    },

});

export default FridgeScreen;
