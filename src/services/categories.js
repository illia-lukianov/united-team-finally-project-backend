import { categoryModel } from "../models/category.js";

export function fetchCategoriesService () {
    return categoryModel.find();
}