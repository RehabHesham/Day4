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
import authMiddlware from "../middlewares/authMiddlware.js";
import authorize from "../middlewares/authorize.js";
const router = Router();

// can use req.user
router.post(
  "/",
  authMiddlware,
  authorize("user"),
  createPostValidator,
  validationHandler,
  createPost,
);
router.get("/", getAllPost);

router.put(
  "/:id",
  authMiddlware,
  authorize("user"),
  updatePostValidator,
  validationHandler,
  updatePost,
);
router.delete(
  "/:id",
  authMiddlware,
  authorize("user", "admin"),
  deletePostValidator,
  validationHandler,
  deletePost,
);

router.post("/:id/comment", authMiddlware, authorize("user"), addComment);

export default router;
