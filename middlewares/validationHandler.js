import { validationResult } from "express-validator";
import HTTPError from "../util/HttpError.js";

export default (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HTTPError(400, "Validation Error");
    error.errors = errors;
    next(error);
  }
  next();
};
