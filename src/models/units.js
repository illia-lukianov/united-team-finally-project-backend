import { model, Schema } from "mongoose";

const unitSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  abbr: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

const unitsModel = model('Unit', unitSchema);

export default unitsModel;