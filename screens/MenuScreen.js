import react from 'react';
import { Button, Image, ImageBackground, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View, } from 'react-native';



const MenuScreen = () => {
    return (
        <ImageBackground 
        source={require('../assets/Menu/Ananas.png')} // Remplace par ton image de fond
        style={styles.background}
    >
        <View style={styles.container}>
            <Image source={require('../assets/Squirrel/Heureux.png')} style={styles.squirrel} />
            <View style={styles.container}>

                <View style={styles.limitConso}>

                    <TouchableOpacity style={styles.alertBanner} onPress={() => navigation.navigate('QuickConsume')}>
                        <Text style={styles.alertText}>A consommer rapidement !</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.stockageContainer}>
                    <TouchableOpacity style={styles.stockageItem}>
                        <View style={styles.imageContainer}>
                            <Image source={require('../assets/Menu/FRIGO.png')} style={styles.iconImage} />
                        </View>
                        <Text style={styles.stockageText}>FRIGO</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.stockageItem}>
                        <View style={styles.imageContainer}>
                            <Image source={require('../assets/Menu/congelo.png')} style={styles.iconImage} />
                        </View>
                        <Text style={styles.stockageText}>CONGÉLO</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.stockageItem}>
                        <View style={styles.imageContainer}>
                            <Image source={require('../assets/Menu/Placard.png')} style={styles.iconImage} />
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
        flex: 1, // Prendre toute la surface disponible
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'#EFE5D8',
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
        backgroundColor: '#b07f5e',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
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
        marginBottom: 70,
        marginTop: 50,
        justifyContent: 'space-between',

    },

    stockageItem: {

        alignItems: 'center',
        marginVertical: 10,
        marginHorizontal: 5,
    },

    imageContainer: {
        backgroundColor: '#b07f5e', // Couleur marron
        padding: 5, // Espacement intérieur
        borderRadius: 10, // Bords arrondis
        alignItems: 'center', // Centrer le contenu
        justifyContent: 'center', // Centrer le contenu
        marginBottom: 5, // Espacement en bas pour le texte
    },

    iconImage: {
        width: 80,
        height: 80,
        marginBottom: 5,
    },

    stockageText: {
        color: '#b07f5e',
        fontWeight: 'bold',
    },

    actionButtons: {

        marginBottom: 20,
        marginTop: 30,
        width: 300,  // Taille du bouton 
       
    },

    button: {
        backgroundColor: '#b07f5e',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
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
