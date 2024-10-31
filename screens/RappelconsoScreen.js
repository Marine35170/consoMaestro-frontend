import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, ImageBackground, ScrollView, TouchableOpacity, Modal } from 'react-native';

const RappelConsoScreen = () => {
    const [productName, setProductName] = useState('');
    const [searchResults, setSearchResults] = useState([
        {
            categorie_de_produit: "Alimentaire",
            nom_de_la_marque_du_produit: "Produit 1",
            noms_des_modeles_ou_references: "Modèle A",
            identification_des_produits: "Code 123",
            motif_du_rappel: "Motif de sécurité",
            risques_encourus_par_le_consommateur: "Risque de contamination",
            preconisations_sanitaires: "Ne pas consommer",
            description_complementaire_du_risque: "Risque de bactéries",
            conduites_a_tenir_par_le_consommateur: "Retour en magasin",
            date_de_fin_de_la_procedure_de_rappel: new Date("2024-12-31"),
            date_debut_fin_de_commercialisation: new Date("2023-05-01"),
        },
        // Ajoutez plus de produits si nécessaire pour tester
    ]);
    const [error, setError] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);

    const openModal = (product) => {
        setSelectedProduct(product);
        setModalVisible(true);
    };

    const closeModal = () => {
        setSelectedProduct(null);
        setModalVisible(false);
    };

    return (
        <ImageBackground source={require('../assets/backgroundMenu.png')} style={styles.background}>
            <View style={styles.container}>
                <Image source={require('../assets/Squirrel/Heureux.png')} style={styles.squirrel} />
                <Text style={styles.title}>Rappel Conso</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Nom du produit"
                    value={productName}
                    onChangeText={setProductName}
                />
                <Button title="Rechercher" onPress={() => {}} />

                {error ? <Text style={styles.error}>{error}</Text> : null}

                <ScrollView style={styles.resultsContainer}>
                    {searchResults.map((recall, index) => (
                        <TouchableOpacity key={index} style={styles.resultItem} onPress={() => openModal(recall)}>
                            <Text style={styles.resultTitle}>{recall.nom_de_la_marque_du_produit}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <Modal
                    transparent={true}
                    visible={isModalVisible}
                    animationType="slide"
                    onRequestClose={closeModal}
                >
                    <View style={styles.modalContainer}>
                        {selectedProduct && (
                            <>
                                <Text style={styles.modalTitle}>Détails du Produit</Text>
                                <Text style={styles.modalText}>Catégorie : {selectedProduct.categorie_de_produit}</Text>
                                <Text style={styles.modalText}>Marque : {selectedProduct.nom_de_la_marque_du_produit}</Text>
                                <Text style={styles.modalText}>Modèle : {selectedProduct.noms_des_modeles_ou_references}</Text>
                                <Text style={styles.modalText}>Identification : {selectedProduct.identification_des_produits}</Text>
                                <Text style={styles.modalText}>Motif du Rappel : {selectedProduct.motif_du_rappel}</Text>
                                <Text style={styles.modalText}>Risque : {selectedProduct.risques_encourus_par_le_consommateur}</Text>
                                <Text style={styles.modalText}>Préconisations : {selectedProduct.preconisations_sanitaires}</Text>
                                <Text style={styles.modalText}>Description Complémentaire : {selectedProduct.description_complementaire_du_risque}</Text>
                                <Text style={styles.modalText}>Conduite à Tenir : {selectedProduct.conduites_a_tenir_par_le_consommateur}</Text>
                                <Text style={styles.modalText}>Fin de la Procédure : {selectedProduct.date_de_fin_de_la_procedure_de_rappel?.toLocaleDateString()}</Text>
                                <Text style={styles.modalText}>Début de Commercialisation : {selectedProduct.date_debut_fin_de_commercialisation?.toLocaleDateString()}</Text>

                                <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                                    <Text style={styles.closeButtonText}>Fermer</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </Modal>
            </View>
        </ImageBackground>
    );
};

export default RappelConsoScreen;

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    squirrel: {
        width: 60,
        height: 60,
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        width: '100%',
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
    resultsContainer: {
        marginTop: 20,
        width: '100%',
    },
    resultItem: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 5,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    resultTitle: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 20,
    },
    modalText: {
        color: '#FFF',
        fontSize: 16,
        marginBottom: 5,
    },
    closeButton: {
        backgroundColor: '#A77B5A',
        padding: 10,
        borderRadius: 10,
        marginTop: 20,
    },
    closeButtonText: {
        color: '#FFF',
        fontSize: 16,
    },
});
