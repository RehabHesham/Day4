import { body, param } from "express-validator";

export const registerValiator = [
  body("name")
    .notEmpty()
    .withMessage("Name is requires")
    .isLength({ min: 3 })
    .withMessage("name at least 3 chars ")
    .escape(),
  body("email").isEmail().withMessage("Valid email required").trim().normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 chars"),
];

export const loginValidator = [
  body("email")
    .isEmail()
    .withMessage("Valid email required")
    .trim()
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 chars"),
];

export const createPostValidator = [
  body("content").notEmpty().withMessage("Content is requires").escape(),
  body("tags").optional().isArray().withMessage("Tags must be array of string"),
  body("tags.*").optional().isString().withMessage("Each tag must be a string"),
];

export const updatePostValidator = [
  param("id").isMongoId().withMessage("Invalid ID Format"),
  body("content")
    .optional()
    .notEmpty()
    .withMessage("Content is requires")
    .escape(),
  body("tags").optional().isArray().withMessage("Tags must be array of string"),
  body("tags.*").optional().isString().withMessage("Each tag must be a string"),
];

export const deletePostValidator = [
  param("id").isMongoId().withMessage("Invalid ID Format"),
];
