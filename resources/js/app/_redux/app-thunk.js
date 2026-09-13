import { get_categories_service } from "../_services/booking-service";
import { appSlice } from "./app-slice";

export function get_app_data_thunk() {
    return async function (dispatch, getState) {
        const result = await get_categories_service();
        dispatch(appSlice.actions.setLessees(result.data));
    };
}
