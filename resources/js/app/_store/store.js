import { configureStore } from "@reduxjs/toolkit";
import appSlice from "../_redux/app-slice";

const store = configureStore({
    reducer: {
        app: appSlice,
    },
});

export const RootState = store.getState;
export const AppDispatch = store.dispatch;

export default store;
