import { createSlice } from "@reduxjs/toolkit";
import data from '../data/data.json'

const boardsSlices = createSlice({
    name: 'boards',
    initialState : data.boards,
    reducers:{
        //write reducer
    }
})

export default boardsSlices