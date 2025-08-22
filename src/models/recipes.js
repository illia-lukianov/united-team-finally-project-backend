import { model, Schema } from 'mongoose';

const recipeSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      // required: true,
    },
    area: {
      type: String,
    },
    instructions: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    thumb: {
      type: String,
      // required: true,
    },
    time: {
      type: String,
      required: true,
    },
    ingredients: {
      type: [],
      required: true,
    },
    cals: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const recipeCollection = model('recipe', recipeSchema);
