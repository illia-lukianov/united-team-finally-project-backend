import { fetchCategoriesService } from "../services/categories.js";

export async function fetchCategoriesController (req, res) {
    const categories = await fetchCategoriesService();
    res.json({
        status: 200,
        categories
    })
}