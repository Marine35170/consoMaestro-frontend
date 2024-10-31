import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    id: null,
    username: '',
};

export const userSlice = createSlice({
 name: 'user',
 

  initialState,
 reducers: {
   addUserIdToStore: (state, action) => {
    state.id = action.payload;
   },
   addUsernameToStore: (state, action) => {
    state.username = action.payload;
   },
 },
});

export const { addUserIdToStore, addUsernameToStore} = userSlice.actions;
export default userSlice.reducer;