import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { View, Text, StyleSheet, Image, ImageBackground, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useIsFocused } from "@react-navigation/native";

const RappelConsoScreen = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [isNoRecallModalVisible, setNoRecallModalVisible] = useState(false); // Modal pour les rappels inexistants
    const [error, setError] = useState('');
    const isFocused = useIsFocused(); // Vérifie si l'écran est en focus

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
                
                setSearchResults(uniqueRecalls); // Stocker les résultats uniques/
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
    }, [isFocused]);

   

    return (
        <ImageBackground source={require('../assets/backgroundRappelConso.png')} style={styles.background}>
            <View style={styles.container}>
                <Image source={require('../assets/Squirrel/Heureux.png')} style={styles.squirrel} />
                <Text style={styles.PageTitle}>Rappel Conso</Text>

                <View style={styles.resultsContainer}>
                    <ScrollView contentContainerStyle={styles.resultsScrollContainer}>
                        {searchResults.map((recall, index) => (
                            <TouchableOpacity key={index} style={styles.resultItem} onPress={() => openModal(recall)}>
                                <Text style={styles.resultTitle}>{recall.noms_des_modeles_ou_references}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
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
                            <View style={styles.modalContent}>
                            <ScrollView contentContainerStyle={styles.scrollContainer}>
                                <Text style={styles.modalTitle}>Détails du Produit</Text>

                                <Text style={styles.modalSectionTitle}>Marque</Text>
                                <Text style={styles.modalText}>{selectedProduct.nom_de_la_marque_du_produit}</Text>

                                <Text style={styles.modalSectionTitle}>Gamme</Text>
                                <Text style={styles.modalText}>{selectedProduct.noms_des_modeles_ou_references}</Text>

                                <Text style={styles.modalSectionTitle}>Identification</Text>
                                <Text style={styles.modalText}>{selectedProduct.identification_des_produits}</Text>

                                <Text style={styles.modalSectionTitle}>Motif du Rappel</Text>
                                <Text style={styles.modalText}>{selectedProduct.motif_du_rappel}</Text>

                                <Text style={styles.modalSectionTitle}>Risque</Text>
                                <Text style={styles.modalText}>{selectedProduct.risques_encourus_par_le_consommateur}</Text>

                                <Text style={styles.modalSectionTitle}>Préconisations</Text>
                                <Text style={styles.modalText}>{selectedProduct.preconisations_sanitaires}</Text>

                                <Text style={styles.modalSectionTitleImportant}>Conduite à Tenir</Text>

                                <Text style={styles.modalText}>{selectedProduct.conduites_a_tenir_par_le_consommateur}</Text>

                                <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                                    <Text style={styles.closeButtonText}>Fermer</Text>
                                </TouchableOpacity>
                            </ScrollView>
                            </View>
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
    PageTitle: {
        fontFamily: "Hitchcut-Regular",
        color: "#E56400", // Couleur du titre
        fontSize: 20,
        textAlign: "center",
        marginBottom: 20,
      },

    resultsContainer: {
        borderWidth: 1,
        backgroundColor: "#69914A",
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
        color: "#E56400",
    },
    
    scrollContainer: {
        flexGrow: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 30,
    },

    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.80)',
       
    },
    modalContent: {
        backgroundColor: "#FAF9F3",
        padding: 15 ,
        borderRadius: 10,
        alignItems: "center",
        width: "80%",
        maxHeight: "80%",  // Cette hauteur limite la taille de la modal
      },
    modalTitle: {
        fontFamily: "Hitchcut-Regular",
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FF4B4C',
        marginBottom: 20,
    },

    modalSectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#E56400',
        marginTop: 10,
    },
    modalSectionTitleImportant:{
        fontFamily: "Hitchcut-Regular",
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FF4B4C',
        marginTop: 10,
        paddingVertical: 20,
    },

    modalText: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: 'bold'
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
        fontWeight: 'bold'
    },
});
