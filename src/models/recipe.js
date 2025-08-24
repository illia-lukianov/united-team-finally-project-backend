import mongoose from "mongoose";

const recipeSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
    },
    owner: {
      type: mongoose.SchemaTypes.ObjectId,
    },
    area: {
      type: String,
    },
    instructions: {
      type: String,
    },
    cals: {
      type: Number,
    },
    description: {
      type: String,
    },
    thumb: {
      type: String,
    },
    time: {
      type: String,
    },
    ingredients: {
      type: [
        {
          newId: { type: mongoose.SchemaTypes.ObjectId, required: false },
          id: { type: mongoose.SchemaTypes.ObjectId, required: false },
          measure: { type: String, required: false },
        },
      ],
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const recipeModel = mongoose.model("Recipe", recipeSchema, "recipes");
