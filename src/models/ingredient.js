import mongoose from 'mongoose';

const ingredientSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const ingredientModel = mongoose.model('Ingredient', ingredientSchema);