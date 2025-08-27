import { model, Schema } from 'mongoose';

const recipesSchema = new Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    area: { type: String, required: true },
    instructions: { type: String, required: true },
    description: { type: String, required: true },
    cals: { type: Number, default: null },
    thumb: { type: String, default: null },
    time: { type: Number, required: true },
    ingredients: [
      new Schema(
        {
          id: { type: Schema.Types.ObjectId, ref: 'Ingredient', required: true, default: [] },
          measure: { type: String, required: true },
        },
        { _id: false },
      ),
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

recipesSchema.index({ title: 'text' });
export const recipesCollection = model('Recipe', recipesSchema, 'recipes');
// recipesCollection.syncIndexes();
