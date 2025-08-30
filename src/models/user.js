import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isConfirmed: {
      type: Boolean,
      required: false,
    },
    avatar: {
      type: String,
      default: null,
    },
    favourites: {
      type: [{ type: Schema.Types.ObjectId, ref: "Recipe" }],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.methods.toJSON = function () {
  const object = this.toObject();
  delete object.password;
  return object;
};

export const User = model("User", userSchema, "users");
