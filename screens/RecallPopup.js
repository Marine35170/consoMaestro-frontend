import React from "react";
import { Modal, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native"; // Importez useNavigation

const RecallPopup = ({ isVisible, onClose, onViewRecalls, recallProduct }) => {
    const navigation = useNavigation(); // Utilisez useNavigation pour accéder à la navigation

    // Fonction pour naviguer vers la page "Rappel Conso"
    const handleRappelConsoPress = () => {
      onClose(); // Fermer la popup
      navigation.navigate("RappelConsoScreen"); // Naviguer vers la page Rappel Conso
    };

  return (
    <Modal transparent={true} visible={isVisible} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Alerte de sécurité sanitaire :</Text>
          <Text style={styles.modalText}>{recallProduct}</Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.closeButton} onPress={handleRappelConsoPress}>
              <Text style={styles.closeButtonText}>Rappels Conso</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FAF9F3",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    color: "#E56400",
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  modalText: {
    fontSize: 15,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '80%',
    marginTop: 20,
    gap: 20,
  },
  closeButton: {
    minWidth: 120,
    backgroundColor: "#A77B5A",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#FFF",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default RecallPopup;