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
                <Image source={require('../assets/scanner.png')} style={styles.scanImage}/>
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
       
        width: 60,
        height: 60,
        marginBottom: 10,
        marginRight: 230,
        marginTop: -40,
    },
    tipsContainer: {
        marginTop: 10,
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        width: '85%',
        height: '25%',
        marginBottom: 20,
    },
    scan: {
      position: 'relative',
       borderWidth: 1,
       width: '85%',
       height: '25%',
       borderRadius: 10,
       marginBottom: 20,
       justifyContent: 'center',
       alignItems: 'center',
       flexDirection: 'column',
       overflow: 'hidden',
    },
    input: {
       
        borderWidth: 1,
        width: '85%',
        height: '10%',
        borderRadius: 10,
        padding: 10,
    },
    buttonText: {
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
