import { fetchIngredientsService } from "../services/ingredients.js";

export async function fetchIngredientsController (req, res) {
    const ingredients = await fetchIngredientsService();

    const ingredientsNames = ingredients.map(item => item.name);
    res.json({
        status: 200,
        message: "Successfully found ingredients!",
        data: ingredientsNames
    })
}