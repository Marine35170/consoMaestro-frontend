import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground, FlatList, ActivityIndicator, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RecipesScreen = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState({});
  const [showModal, setShowModal] = useState(false);

  const SPOONACULAR_API_KEY = '458abe4b51cf4c33b7124445f4105feb';

  const fetchRecipes = async (newPage = 1) => {
    try {
      if (newPage === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await fetch(`https://api.spoonacular.com/recipes/random?number=4&apiKey=${SPOONACULAR_API_KEY}&page=${newPage}`);
      const data = await response.json();
      setRecipes((prevRecipes) => [...prevRecipes, ...data.recipes]);

      setLoading(false);
      setLoadingMore(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des recettes:', error);
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchRecipes(); // Chargement initial
  }, []);

  const loadMoreRecipes = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchRecipes(nextPage);
  };

  // Fonction pour basculer l'état de favori
  const toggleFavorite = async (recipe) => {
    const { id, title, image } = recipe;

    // Vérifiez si la recette est déjà dans les favoris
    const isFavorite = favorites[id];

    try {
      if (isFavorite) {
        // Appeler la route DELETE pour retirer des favoris
        const response = await fetch(`https://conso-maestro-backend.vercel.app/api/recipes/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setFavorites((prevFavorites) => {
            const updatedFavorites = { ...prevFavorites };
            delete updatedFavorites[id];
            return updatedFavorites;
          });
        } else {
          console.error('Erreur lors de la suppression de la recette mise en favori');
        }
      } else {
        // Appeler la route POST pour ajouter aux favoris
        const response = await fetch('https://conso-maestro-backend.vercel.app/api/recipes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: '', title, image }), 
        });

        if (response.ok) {
          const data = await response.json();
          setFavorites((prevFavorites) => ({
            ...prevFavorites,
            [id]: true,
          }));
        } else {
          console.error('Erreur lors de la sauvegarde de la recette mise en favori');
        }
      }
    } catch (error) {
      console.error('Erreur lors de la gestion du favori:', error);
    }
  };

  // Fonction pour ouvrir la modale des favoris
  const openFavoritesModal = () => {
    setShowModal(true);
  };

  // Fonction pour fermer la modale des favoris
  const closeFavoritesModal = () => {
    setShowModal(false);
  };

  const favoriteRecipes = recipes.filter((recipe) => favorites[recipe.id]);

  return (
    <ImageBackground source={require('../assets/backgroundRecipe.png')} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={openFavoritesModal}>
            <Ionicons name="heart" size={32} color="red" />
          </TouchableOpacity>
        </View>
        <Text style={styles.textfavories}>Mes favories</Text>
        <Text style={styles.text}>Idées recettes</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#FFF" />
        ) : (
          <FlatList
            data={recipes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.recipeCard}>
                            <Image source={{ uri: item.image }} style={styles.recipeImage} />
                <Text style={styles.recipeTitle}>{item.title}</Text>
                <TouchableOpacity
                  style={styles.heartIcon}
                  onPress={() => toggleFavorite(item.id)}
                >
                  <Ionicons
                    name={favorites[item.id] ? 'heart' : 'heart-outline'}
                    size={24}
                    color={favorites[item.id] ? 'red' : 'gray'}
                  />
                </TouchableOpacity>
              </View>
            )}
            onEndReached={loadMoreRecipes}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              loadingMore ? <ActivityIndicator size="small" color="#FFF" /> : null
            }
          />
        )}

        {/* Modale pour les recettes favorites */}
        <Modal
          visible={showModal}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Mes recettes favorites</Text>
              <ScrollView>
                {favoriteRecipes.length > 0 ? (
                  favoriteRecipes.map((recipe) => (
                    <View key={recipe.id} style={styles.favoriteCard}>
                      <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
                      <Text style={styles.recipeTitle}>{recipe.title}</Text>
                      <TouchableOpacity
                        onPress={() => toggleFavorite(recipe.id)}
                        style={styles.removeButton}
                      >
                        <Ionicons name="trash" size={24} color="red" />
                        <Text style={styles.removeButtonText}>Retirer</Text>
                      </TouchableOpacity>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noFavoritesText}>Aucune recette en favori</Text>
                )}
              </ScrollView>
              <TouchableOpacity onPress={closeFavoritesModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
};



export default RecipesScreen;

    
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
      },
      header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '90%',
        marginBottom: 20,
      },
      headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
      },
      text: {
        fontSize: 24,
        fontFamily: "Hitchcut-Regular",
        color: '#F0672D',
        marginTop: 40,
        top: -73,
      },
      textfavories: {
        fontSize: 19,
        fontFamily: "Hitchcut-Regular",
        color: '#F0672D',
        marginBottom: 20,
        marginTop: 19,
        top: -73,
        right: 58,
      },
      recipeCard: {
        backgroundColor: '#F0672D',
        borderRadius: 10,
        padding: 10,
        marginVertical: 10,
        alignItems: 'center',
        width: '88%',
        alignSelf: 'center',
        position: 'relative',
      },
      heartIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
      },
      recipeTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
      },
      recipeImage: {
        width: '82%',
        height: 150,
        borderRadius: 10,
      },
      modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      modalContent: {
        backgroundColor: '#FFF',
        borderRadius: 10,
        padding: 20,
        width: '80%',
        maxHeight: '80%',
      },
      modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      favoriteCard: {
        marginBottom: 15,
      },
      noFavoritesText: {
        fontSize: 16,
        fontStyle: 'italic',
      },
      closeButton: {
        marginTop: 20,
        alignSelf: 'center',
      },
      closeButtonText: {
        fontSize: 16,
        color: 'blue',
      },
    });