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
        <Button title="Je scanne mon produit" onPress={handleScanPress} />

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
});
