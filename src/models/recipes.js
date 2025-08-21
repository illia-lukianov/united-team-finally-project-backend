import { model, Schema } from 'mongoose';

const recipeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    decr: {
      type: String,
      required: true,
    },
    cookiesTime: {
      type: Number,
      required: true,
    },
    cals: {
      type: Number,
    },
    category: {
      type: String,
      enum: [''],
      required: true,
    },
    ingredient: {
      type: String,
      required: true,
    },
    ingredientAmount: {
      type: Number,
      required: true,
    },
    instruction: {
      type: String,
      required: true,
    },
    recipeImg: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const recipeCollection = model('recipe', recipeSchema);
