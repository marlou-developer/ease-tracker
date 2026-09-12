import { createSlice } from "@reduxjs/toolkit";

export const appSlice = createSlice({
    name: "app",
    initialState: {
        categories: [],
    },
    reducers: {
        setCategories: (state, action) => {
            state.categories = action.payload;
        },
    },
});
export const { setCategories } = appSlice.actions;

export default appSlice.reducer;
