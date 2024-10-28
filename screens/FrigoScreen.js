import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";



const FridgeScreen = () => {

    const handleFreezerPress = () => {
        {/* Naviguer vers la page du congélateur */}
        navigation.navigate('FreezerScreen');
      };
      const handleCeboardPress = () => {
        {/* Naviguer vers la page du placard */}
        navigation.navigate('PantryScreen ');
      };

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
          <Image source={require("../assets/FRIGO")} style={styles.frigoLogo} />
      </View>

      {/* Boutons d'accès au congélateur */}
      <View style={styles.stocksButtonsContainer}>
      <TouchableOpacity style={styles.freezer} onPress={handleFreezerPress}>
                <Text style={styles.buttonText}>Mon Congélo</Text>
                
        </TouchableOpacity>
      {/* Boutons d'accès aux placards */}
        <TouchableOpacity style={styles.ceboard} onPress={handleCeboardPress}>
                <Text style={styles.buttonText}>Mes Placards</Text>
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
    PageTitle:{

    },
    productContainer:{

    },
    ProductTitle: {
        position: 'absolute',
       marginTop: 20,
        textAlign: 'center',
        color: 'black',
        fontSize: 20,
        top: 0,
        
    },
    tipsText: {
        fontSize: 15,
        textAlign: 'center',
    },
    DLCDate:{

    },
    frigoLogo:{

    },
    stocksButtonsContainer: {
       
        borderWidth: 1,
        width: '85%',
        height: '10%',
        borderRadius: 10,
        padding: 10,
    },

});

export default FridgeScreen;
