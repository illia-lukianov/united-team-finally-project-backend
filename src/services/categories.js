import { categoryModel } from "../models/category.js";

export function fetchCategoriesService () {
    return categoryModel.find({}, { name: 1 , _id: 0});
}