import {
  createPost,
  getAllPost,
  updatePost,
  deletePost,
  addComment,
} from "../controllers/postController.js";
import { Router } from "express";

import {
  createPostValidator,
  updatePostValidator,
  deletePostValidator,
} from "../middlewares/validator.js";
import validationHandler from "../middlewares/validationHandler.js";

const router = Router();


// can use req.user
router.post("/", createPostValidator, validationHandler, createPost);
router.get("/", getAllPost);

router.put("/:id", updatePostValidator, validationHandler, updatePost);
router.delete("/:id", deletePostValidator, validationHandler, deletePost);

router.post("/:id/comment", addComment);

export default router;
