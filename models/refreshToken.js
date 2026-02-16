import { Schema, model } from "mongoose";

const resfreshtokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { TimeStamps: true },
);

export default model("RefreshToken", resfreshtokenSchema);
