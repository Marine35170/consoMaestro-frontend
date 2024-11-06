import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Image, ImageBackground, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View, } from 'react-native';



const MenuScreen = () => {
    const navigation = useNavigation();

    const handleFridgePress = () => {                       // Permet d'aller vers la page frigo
        navigation.navigate('InventaireScreen', { storageType: 'frigo' });
    };

    const handleCongeloPress = () => {                      // Permet d'aller vers la page Congelo 
        navigation.navigate('InventaireScreen', { storageType: 'congelo' })
    }


    const handlePlacardPress = () => {                      // Permet d'aller vers la page Placard
        navigation.navigate('InventaireScreen', { storageType: 'placard' })
    };

    const handleQuickConsumePress = () => {                 // Permet d'aller vers la page " A consommer rapidement"
        navigation.navigate('QuickConsoScreen');
    };

    const handleRecipePress = () => {                       // Permet d'aller ver la plage "Idées recettes"
        navigation.navigate('RecipesScreen');
    };
    const handleRappelConsoPress = () => {                  // Permet d'aller à la page "rappel conso"
        navigation.navigate('RappelConsoScreen');
    };

    return (
        <ImageBackground source={require('../assets/backgroundMenuv2.png')} style={styles.background}>
            <View style={styles.container}>
                <Image source={require('../assets/Squirrel/Heureux.png')} style={styles.squirrel} />
                <Text style={styles.PageTitle}> Ma Cuisine </Text>

                {/* Conteneur pour les alertes et rappels conso */}
                <View style={styles.alertContainer}>
                    <TouchableOpacity style={styles.buttonDGCCRF} onPress={handleRappelConsoPress}>
                        <View style={styles.textContainer}>
                            <Text style={styles.buttonText}>Mes rappels conso</Text>
                            <Text style={styles.buttonText}>DGCCRF</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.alertBanner} onPress={handleQuickConsumePress}>
                        <Text style={styles.buttonText}>A consommer rapidement !</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.stockageContainer}>
                    <TouchableOpacity style={styles.stockageItem} onPress={handleFridgePress}>
                        <View style={styles.imageContainer}>
                            <Image source={require('../assets/FRIGO.png')} style={styles.iconImage} />
                        </View>
                        <Text style={styles.stockageText}>FRIGO</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.stockageItem} onPress={handleCongeloPress}>
                        <View style={styles.imageContainer}>
                            <Image source={require('../assets/congelo.png')} style={styles.iconImage} />
                        </View>
                        <Text style={styles.stockageText}>CONGÉLO</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.stockageItem} onPress={handlePlacardPress}>
                        <View style={styles.imageContainer}>
                            <Image source={require('../assets/Placard.png')} style={styles.iconImage} />
                        </View>
                        <Text style={styles.stockageText}>PLACARD</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.centeredButtonContainer}>
                    <TouchableOpacity style={styles.buttonRecipe} onPress={handleRecipePress}>
                        <View style={styles.iconAndText}>

                            <Text style={styles.buttonText}>Idées recettes</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    )
};

export default MenuScreen;

const styles = StyleSheet.create({

    // Background     

    background: {
        flex: 1,
        resizeMode: 'cover',
    },

    // Container global 

    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start', // Alignement en haut
        paddingTop: 50, // Pour éviter que l'écureuil soit collé en haut
    },

    // Icone écurreil 
    PageTitle: {
        fontFamily: "Hitchcut-Regular",
        color: "#E56400", // Couleur du titre
        fontSize: 25,
        textAlign: "center",
        marginBottom: 20,
        marginTop: 10,

    },

    squirrel: {
        position: "absolute",
        width: 60,
        height: 60,
        top: 35,
        left: 30,
    },


    // Style du bouton " a consommer rapidement !" 

    alertBanner: {
        backgroundColor: '#F0672D',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginTop: 30,
        marginBottom: 30,
        width: 300,
        alignItems: 'center', // Centre horizontalement le texte
        justifyContent: 'center', // Centre verticalement le texte

    },

    // Container des images des stockages (frigo congelo placards)

    stockageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
        marginHorizontal: 20,
        marginBottom: 50,
        marginTop: 30,
        justifyContent: 'space-between',
    },

    // Dispositions des images des stockages (frigo congelo placards)

    stockageItem: {

        alignItems: 'center',
        marginVertical: 10,
        marginHorizontal: 5,
    },

    // Petits carrés marron autour des images 
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

    // Format des images de stockage (frigo congelo placards)

    iconImage: {
        width: 80,
        height: 80,
        marginBottom: 5,
    },
    // Texte des stockage (frigo congelo placards)

    stockageText: {
        fontFamily: "Hitchcut-Regular",
        color: '#664C25',
        fontSize: 16,
    },

    // Bouton "idées recettes"

    buttonRecipe: {
        backgroundColor: '#69914a',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignSelf: 'flex-start', // Ajuste le bouton à la largeur de son contenu
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',

    },
    // Bouton "mes rappels conso DGCCRF"

    buttonDGCCRF: {
        backgroundColor: '#FF4C4C',
        paddingVertical: 10,
        paddingHorizontal: 40,
        borderRadius: 10,
        marginTop: 80,           // Espacement par rapport au haut
        width: 300,
        alignItems: 'center',    // Centre le contenu horizontalement
        justifyContent: 'center',
      },
      
      textContainer: {
        alignItems: 'center',    // Centre le texte dans le bouton
      },
    // Texte des boutons

    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: "bold",


    },
    iconAndText: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    icon: {
        marginRight: 10, // Ajout de cette ligne pour espacer l'icône et le texte
    },

});
