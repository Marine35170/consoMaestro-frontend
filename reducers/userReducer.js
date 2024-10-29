import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    id: null,
};

export const userSlice = createSlice({
 name: 'user',

  initialState,
 reducers: {
   addUserIdToStore: (state, action) => {
    state.id = action.payload;
   },
 },
});

export const { addUserIdToStore } = userSlice.actions;
export default userSlice.reducer;