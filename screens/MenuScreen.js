import { useNavigation } from '@react-navigation/native';
import {Button, Image,ImageBackground,KeyboardAvoidingView,Platform,StyleSheet,Text,TextInput,TouchableOpacity,View, } from 'react-native';



const MenuScreen = () => {
    const navigation = useNavigation();
    const handleFridgePress = () => {
        {/* Naviguer vers la page du frigo */}
        navigation.navigate('FridgeScreen');
      };
    return ( <ImageBackground source={require('../assets/backgroundMenu.png')} style={styles.background}>
        <View style={styles.container}>
            <Image source={require('../assets/Squirrel/Heureux.png')} style={styles.squirrel} />
            <View style={styles.container}>

                <View style={styles.limitConso}>

                    <TouchableOpacity style={styles.alertBanner} onPress={() => navigation.navigate('QuickConsume')}>
                        <Text style={styles.alertText}>A consommer rapidement !</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.stockageContainer}>
                    <TouchableOpacity style={styles.stockageItem}onPress= {handleFridgePress}>
                        <View style={styles.imageContainer}>
                            <Image source={require('../assets/FRIGO.png')} style={styles.iconImage} />
                        </View>
                        <Text style={styles.stockageText}>FRIGO</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.stockageItem}>
                        <View style={styles.imageContainer}>
                            <Image source={require('../assets/congelo.png')} style={styles.iconImage} />
                        </View>
                        <Text style={styles.stockageText}>CONGÉLO</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.stockageItem}>
                        <View style={styles.imageContainer}>
                            <Image source={require('../assets/Placard.png')} style={styles.iconImage} />
                        </View>
                        <Text style={styles.stockageText}>PLACARDS</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Idées recettes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Mes rappels conso (DGCCRF)</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
        </ImageBackground>
    );
};

export default MenuScreen;

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
      },
      container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start', // Alignement en haut
        paddingTop: 50, // Pour éviter que l'écureuil soit collé en haut
    },
    squirrel: {
        width: 60,
        height: 60,
        marginBottom: 10,
        marginRight: 230,
    },

    limitConso: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },

    alertBanner: {
        backgroundColor: '#A77B5A',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginBottom: 40,
        width: 300,
        alignItems: 'center', // Centre horizontalement le texte
        justifyContent: 'center', // Centre verticalement le texte
    },

    alertText: {
        color: '#fff',
        fontWeight: 'bold',
    },

    stockageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
        marginHorizontal: 20,
        marginBottom: 50,
        marginTop: 50,
        justifyContent: 'space-between',
    },

    stockageItem: {

        alignItems: 'center',
        marginVertical: 10,
        marginHorizontal: 5,
    },

    imageContainer: {
        backgroundColor: '#A77B5A', // Couleur marron
        padding: 5,                 // Espacement intérieur
        borderRadius: 10,           // Bords arrondis
        alignItems: 'center',       // Centrer le contenu
        justifyContent: 'center',   // Centrer le contenu
        marginBottom: 5,            // Espacement en bas pour le texte
        borderWidth: 2,             // Épaisseur de la bordure
        borderColor: '#FAF9F3',     // Couleur de la bordure
    },

    iconImage: {
        width: 80,
        height: 80,
        marginBottom: 5,
    },

    stockageText: {
        color: '#664C25',
        fontWeight: 'bold',
    },

    actionButtons: {

        marginBottom: 20,
        marginTop: 60,
        width: 300,  // Taille du bouton 
       
       
    },

    button: {
        backgroundColor: '#A77B5A',
        paddingVertical: 10,
        paddingHorizontal: 40,
        borderRadius: 10,
        marginVertical: 10,
        alignItems: 'center', // Centre horizontalement le texte
        justifyContent: 'center', // Centre verticalement le texte

    },

    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        direction: 'flex',
        alignItems: 'center',
        alignContent: 'center',
    },

});
