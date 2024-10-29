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
        <Image source={require('../assets/Squirrel/Heureux.png')} style={styles.squirrel}/>
        <View style={styles.container}>
           
            <View style={styles.limitConso}>
                <Image source={{ uri: 'icon.png' }} style={styles.profileIcon} />
                <TouchableOpacity style={styles.alertBanner} onPress={() => navigation.navigate('QuickConsume')}>
                    <Text style={styles.alertText}>A consommer rapidement !</Text>
                </TouchableOpacity>
            </View>

                        <View style={styles.stockageOptions}>  
                <TouchableOpacity style={styles.stockageItem} onPress={handleFridgePress}>
                    <Image source={{ uri: '../assets/FRIGO.png' }} style={styles.iconImage} />
                    <Text style={styles.stockageText}>FRIGO</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.stockageItem}>
                    <Image source={{ uri: '../assets/congelo.png' }} style={styles.iconImage} />
                    <Text style={styles.stockageText}>CONGÉLO</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.stockageItem}>
                    <Image source={{ uri: '../assets/Placard' }} style={styles.iconImage} />
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
        justifyContent: 'center',
      },
    squirrel: {
        position: 'absolute',
        width: 50,
        height: 50,
        top: 30,
        left: 30,
    },
    
    limitConso: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    profileIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
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
    storageOptions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    stockageItem: {
        alignItems: 'center',
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
        alignItems: 'center',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#b07f5e',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginVertical: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },

});
            