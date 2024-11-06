import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { View, Text, StyleSheet, Image, ImageBackground, ScrollView, TouchableOpacity, Modal } from 'react-native';

const RappelConsoScreen = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [isNoRecallModalVisible, setNoRecallModalVisible] = useState(false); // Modal pour les rappels inexistants
    const [error, setError] = useState('');

    const userId = useSelector((state) => state.user.id);

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

    // Ferme le modal "Pas de produit rappelé"
    const closeNoRecallModal = () => {
        setNoRecallModalVisible(false);
    };

    // Fonction pour récupérer les rappels depuis l'API
    const fetchRecalls = async () => {
        try {
            const response = await fetch(`http://conso-maestro-backend.vercel.app/rappels/check-recall/${userId}`);
            const data = await response.json();
            if (data && data.recalls) {
                // Filtrer les doublons en utilisant un Set basé sur un identifiant unique, ici nom_de_la_marque_du_produit
                const uniqueRecalls = data.recalls.filter((recall, index, self) =>
                    index === self.findIndex((r) => (
                        r.nom_de_la_marque_du_produit === recall.nom_de_la_marque_du_produit
                    ))
                );
                setSearchResults(uniqueRecalls); // Stocker les résultats uniques
            } else {
                setSearchResults([]); // Réinitialiser les résultats si aucun rappel trouvé
                setNoRecallModalVisible(true); // Afficher le modal "Pas de produit rappelé"
            }
        } catch (err) {
            console.error("Erreur lors de la récupération des données :", err);
            setError("Erreur lors de la récupération des données.");
        }
    };

    useEffect(() => {
        fetchRecalls();
    }, []);

    return (
        <ImageBackground source={require('../assets/backgroundMenu.png')} style={styles.background}> 
            <View style={styles.container}>
                <Image source={require('../assets/Squirrel/Heureux.png')} style={styles.squirrel} />
                <Text style={styles.title}>Rappel Conso</Text>

                <View style={styles.resultsContainer}>
                    {searchResults.map((recall, index) => (
                        <TouchableOpacity key={index} style={styles.resultItem} onPress={() => openModal(recall)}>
                            <Text style={styles.resultTitle}>{recall.nom_de_la_marque_du_produit}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Modal Détails du Produit */}
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

                {/* Modal Pas de produit rappelé */}
                <Modal
                    transparent={true}
                    visible={isNoRecallModalVisible}
                    animationType="slide"
                    onRequestClose={closeNoRecallModal}
                >
                    <View style={styles.noRecallModalContainer}>
                        <Text style={styles.noRecallModalText}>Pas de produit rappelé</Text>
                        <TouchableOpacity style={styles.closeButton} onPress={closeNoRecallModal}>
                            <Text style={styles.closeButtonText}>Fermer</Text>
                        </TouchableOpacity>
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
    resultsContainer: {
        borderWidth: 1,
        backgroundColor: "#A77B5A",
        borderColor: "#A77B5A",
        width: "85%",
        height: "65%",
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
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
    noRecallModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 20,
    },
    noRecallModalText: {
        color: '#FFF',
        fontSize: 18,
        marginBottom: 20,
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
