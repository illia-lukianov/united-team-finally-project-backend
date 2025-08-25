import { fetchCategoriesService } from "../services/categories.js";

export async function fetchCategoriesController (req, res) {
    const categories = await fetchCategoriesService();
    const categoriesNames = categories.map(item => item.name);
    res.json({
        status: 200,
        message: "Successfully found categories!",
        data: categoriesNames
    })
}