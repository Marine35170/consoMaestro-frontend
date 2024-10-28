import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const MenuScreen = () => {
    return (
        <View style={styles.container}>
           
            <View style={styles.header}>
                <Image source={{ uri: 'icon.png' }} style={styles.profileIcon} />
                <TouchableOpacity style={styles.alertBanner} onPress={() => navigation.navigate('QuickConsume')}>
                    <Text style={styles.alertText}>A consommer rapidement !</Text>
                </TouchableOpacity>
            </View>

                        <View style={styles.stockageOptions}>  
                <TouchableOpacity style={styles.stockageItem}>
                    <Image source={{ uri: '../assets/FRIGO.png' }} style={styles.iconImage} />
                    <Text style={styles.storageText}>FRIGO</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.stockageItem}>
                    <Image source={{ uri: '../assets/congelo.png' }} style={styles.iconImage} />
                    <Text style={styles.storageText}>CONGÉLO</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.ststockageItem}>
                    <Image source={{ uri: '../assets/Placard' }} style={styles.iconImage} />
                    <Text style={styles.storageText}>PLACARDS</Text>
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

            
            <View style={styles.footer}>
                <TouchableOpacity style={styles.navIcon}><Text style={styles.navIconText}>🏠</Text></TouchableOpacity>
                <TouchableOpacity style={styles.navIcon}><Text style={styles.navIconText}>🔔</Text></TouchableOpacity>
                <TouchableOpacity style={styles.navIcon}><Text style={styles.navIconText}>☰</Text></TouchableOpacity>
            </View>
        </View>
    );
};

export default MenuScreen;
            