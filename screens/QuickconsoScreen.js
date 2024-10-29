import React from 'react';
import { View, Text, StyleSheet, Image, ImageBackground } from 'react-native';

const QuickConsoScreen = () => {
    return (
        <ImageBackground source={require('../assets/backgroundMenu.png')} style={styles.background}>
            <View style={styles.container}>
                <Image source={require('../assets/Squirrel/Heureux.png')} style={styles.squirrel} />
                <View>
                    <Text style={styles.text}>Écran : A Consommer Rapidement</Text>
                </View>
            </View>
        </ImageBackground>
    );
};

            export default QuickConsoScreen;

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

squirrel: {
    width: 60,
    height: 60,
    marginBottom: 10,
    marginRight: 230,
},


});