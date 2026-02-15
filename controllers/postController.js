import Post from "../models/Post.js";
import HTTPError from "../util/HttpError.js";

export const createPost = async (req, res, next) => {
  try {
    let { content, tags } = req.body;
    let { userId } = req.user;
    const post = await Post.create({
      user: userId,
      content,
      ...(tags && { tags }),
    });

    return res.status(201).json({
      message: "post created",
      data: post,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllPost = async (req, res, next) => {
  try {
    const posts = await Post.find().populate("user", "name email");
    return res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    let postId = req.params.id;
    let { content, tags } = req.body;

    const post = await Post.findById(postId);
    if (!post) return next(new HTTPError(404, "Post not found"));

    post.content = content || post.content;
    post.tags = tags || post.tags;

    await post.save(); // run mongoose validations
    return res.status(200).json({
      message: "post updated",
      data: post,
    });
  } catch (err) {
    next(err);
  }
};
export const deletePost = async (req, res, next) => {
  try {
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) return next(new HTTPError(404, "Post not found"));

    await post.deleteOne();
    return res.json({
      message: "post deleted",
    });
  } catch (err) {
    next(err);
  }
};
export const addComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const {userId} = req.user;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) return next(new HTTPError(404, "Post not found"));

    post.comments.push({ user: userId, content });
    await post.save();

    return res.status(201).json({
      message: "comment created",
      data: post,
    });
  } catch (err) {
    next(err);
  }
};
