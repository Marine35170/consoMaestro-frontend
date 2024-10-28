import react from 'react';
import {Button, Image,ImageBackground,KeyboardAvoidingView,Platform,StyleSheet,Text,TextInput,TouchableOpacity,View, } from 'react-native';



export default function HomeScreen({navigation}) {

        
      
        const handleScanPress = () => {
          {/* Naviguer vers la page de scan de produit*/}
          navigation.navigate('ScanPage');
        };

    return (
        <View style={styles.container}>
        <Image source={require('../assets/Squirrel/Heureux.png')} style={styles.squirrel}/>

        {/* Trucs et astuces */}    
        <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>Trucs et Astuces</Text>
        <Text style={styles.tipsText}>Astuce 1: Profitez de notre fonctionnalité de scan rapide pour trouver vos produits !</Text>
        </View>
        <TouchableOpacity style={styles.scan} onPress={handleScanPress}>
                <Text style={styles.buttonText}>Je scanne mon produit</Text>
        </TouchableOpacity>

        {/* Champ de saisie pour le code-barres */}
      <TextInput
        style={styles.input}
        placeholder="Je saisis mon code-barres"
        keyboardType="numeric"
      />
    </View>

    );
    }


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EFE5D8',
        alignItems: 'center',
        justifyContent: 'center',
    },
    squirrel: {
        position: 'absolute',
        width: 50,
        height: 50,
        top: 30,
        left: 30,
    },
    tipsContainer: {
        
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        width: 300,
        height: 255,
        marginBottom: 20,
    },
    scan: {
       
       borderWidth: 1,
       width: 300,
       height: 170,
       borderRadius: 10,
       marginBottom: 20,
    },
    input: {
       
        borderWidth: 1,
        width: 300,
        height: 50,
        borderRadius: 10,
        padding: 10,
    },

});
