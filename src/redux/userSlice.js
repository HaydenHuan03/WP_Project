import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated:false,
    user:null,
  }
  
  const userSlice = createSlice({
      name: 'user',
      initialState,
      reducers: {
        loginUser: (state, action) => {
          state.isAuthenticated = true;
          state.user = action.payload;
        },
        logoutUser: (state) => {
          state.isAuthenticated = false;
          state.user = null;
        },
      },    
})

export const { loginUser, logoutUser } = userSlice.actions;
export default userSlice;