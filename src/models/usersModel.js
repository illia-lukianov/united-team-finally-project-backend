import { model, Schema } from "mongoose";

const usersSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform(doc, user) {
        delete user.password;
        return user;
      },
    },
  }
);

export const usersCollection = model("Users", usersSchema);
