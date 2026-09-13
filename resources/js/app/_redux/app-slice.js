import { createSlice } from "@reduxjs/toolkit";

export const appSlice = createSlice({
    name: "app",
    initialState: {
        categories: [],
        lessees: [],
    },
    reducers: {
        setCategories: (state, action) => {
            state.categories = action.payload;
        },
        setLessees: (state, action) => {
            state.lessees = action.payload;
        },
    },
});
export const { setCategories, setLessees } = appSlice.actions;

export default appSlice.reducer;
