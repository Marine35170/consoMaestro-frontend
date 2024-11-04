import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, ImageBackground, ScrollView, TouchableOpacity, Modal } from 'react-native';

const RappelConsoScreen = () => {
    const [productName, setProductName] = useState(''); // Stocke le nom du produit à rechercher
    const [searchResults, setSearchResults] = useState([]); // Résultats de rappel récupérés depuis l'API
    const [filteredResults, setFilteredResults] = useState([]); // Résultats de rappel filtrés
    const [error, setError] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null); // Produit sélectionné pour le modal
    const [isModalVisible, setModalVisible] = useState(false);

    // Ouvre le modal avec les détails du produit
    const openModal = (product) => {
        setSelectedProduct(product);
        setModalVisible(true);
    };

    // Ferme le modal
    const closeModal = () => {
        setSelectedProduct(null);
        setModalVisible(false);
    };

    // Fonction pour récupérer les rappels depuis l'API
    const fetchRecalls = async () => {
        try {
            const response = await fetch('http://conso-maestro-backend.vercel.app/rappels/fetch-recalls');
            const data = await response.json();
            if (data.result) {
                setSearchResults(data.data);
                setFilteredResults(data.data); // Initialement, tous les résultats sont affichés
            } else {
                setError(data.message || 'Aucun rappel trouvé.');
            }
        } catch (err) {
            setError('Erreur lors de la récupération des données.');
            console.error("Détails de l'erreur :", err);
        }
    };

    // Exécute `fetchRecalls` une fois au montage du composant
    useEffect(() => {
        fetchRecalls();
    }, []);

    // Filtre les rappels en fonction du nom du produit saisi
    const handleSearch = () => {
        const filtered = searchResults.filter(recall => 
            recall.nom_de_la_marque_du_produit.toLowerCase().includes(productName.toLowerCase())
        );
        setFilteredResults(filtered);
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
                <Button title="Rechercher" onPress={handleSearch} />

                {error ? <Text style={styles.error}>{error}</Text> : null}

                <ScrollView style={styles.resultsContainer}>
                    {filteredResults.map((recall, index) => (
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
