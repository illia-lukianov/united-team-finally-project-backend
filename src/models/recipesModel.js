import { model, Schema } from "mongoose";

const recipesSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      // ref: "Category",
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    area: {
      type: Schema.Types.ObjectId,
      ref: "Areas",
      required: true,
    },
    instruction: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    calories: {
      type: Number,
      required: false,
      default: null,
    },
    thumb: {
      type: String,
      required: false,
      default: null,
    },
    time: {
      type: Number,
      required: true,
    },
    ingredients: [
      new Schema(
        {
          id: {
            type: Schema.Types.ObjectId,
            ref: "Ingredient",
            required: true,
          },
          measure: { type: String, required: true },
        },
        { _id: false }
      ),
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const recipesCollection = model("Recipes", recipesSchema);
