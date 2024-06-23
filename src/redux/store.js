import {configureStore} from "@reduxjs/toolkit";
import boardsSlice from './boardSlice'
import userSlice from './userSlice'

const userFromLocalStorage = localStorage.getItem('user');

const preloadedState = {
    user: {
        isAuthenticated: !!userFromLocalStorage,
        user: userFromLocalStorage ? JSON.parse(userFromLocalStorage) : null,
    }
};

const store = configureStore({
        reducer: {
            boards : boardsSlice.reducer,
            user: userSlice.reducer,
    },
    preloadedState
})

export default store
