import axios from "axios";

export async function get_categories_service() {
    return await axios.get(`/api/v1/categories`);
}