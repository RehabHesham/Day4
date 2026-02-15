// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({});

import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      //match: /^[a-zA-Z ]*$/,
    },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: {
      type: String,
      required: true,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true, //createdAt, updatedAt
  },
);

userSchema.pre("save", async function () {
  // this keyword  => current user object

  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (inputPassword) {
  const isMatched = await bcrypt.compare(inputPassword, this.password);
  return isMatched;
};

export default model("User", userSchema);
