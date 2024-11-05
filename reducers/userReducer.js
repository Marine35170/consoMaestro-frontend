// Importation de la fonction `createSlice` de Redux Toolkit pour créer un slice de l'état utilisateur
import { createSlice } from '@reduxjs/toolkit';

// État initial du slice utilisateur avec un ID nul et un nom d'utilisateur vide
const initialState = {
    id: null,
    username: '',
};

// Création du slice utilisateur avec le nom `user` et les actions associées
export const userSlice = createSlice({
    name: 'user', // Nom du slice
    
    initialState, // État initial

    reducers: {
        // Action pour ajouter l'ID de l'utilisateur dans le store
        addUserIdToStore: (state, action) => {
            state.id = action.payload; // Mise à jour de l'ID avec la valeur reçue dans `action.payload`
        },
        
        // Action pour ajouter le nom d'utilisateur dans le store
        addUsernameToStore: (state, action) => {
            state.username = action.payload; // Mise à jour du nom d'utilisateur avec la valeur reçue dans `action.payload`
        },
    },
});

// Exportation des actions pour pouvoir les utiliser dans les composants
export const { addUserIdToStore, addUsernameToStore } = userSlice.actions;

// Exportation du reducer du slice utilisateur pour le connecter au store Redux
export default userSlice.reducer;
