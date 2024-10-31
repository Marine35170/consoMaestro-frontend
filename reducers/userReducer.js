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
    state.username = action.payload.username;
   },
 },
});

export const { addUserIdToStore } = userSlice.actions;
export default userSlice.reducer;