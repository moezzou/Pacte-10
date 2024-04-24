import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
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
    role: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    tokens: {
      type: Number,
      default: 0,
    },
    lastModified: {
      type: Date,
      default: Date.now,
    },
    tokensAdded: {
      type: Number,
      default: 0,
    },
  },
  {
    collection: "user-data",
  }
);

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
