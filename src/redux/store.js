import {configureStore} from "@reduxjs/toolkit";
import boardsSlice from './boardSlice'
import userSlice from './userSlice'

const store = configureStore({
        reducer: {
            boards : boardsSlice.reducer,
            user: userSlice.reducer,
    }
})

export default store
