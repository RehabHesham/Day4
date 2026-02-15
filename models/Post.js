import { Schema, model } from "mongoose";

// subdocument
const commentSchema = new Schema(
  {
    content: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

const postSchema = new Schema(
  {
    content: { type: String, required: true },
    tags: [{ type: String }],
    comments: [commentSchema],
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

export default model("Post", postSchema);
