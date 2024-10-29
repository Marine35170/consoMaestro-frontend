import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PlacardScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Contenu des Placards</Text>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});

export default PlacardScreen;