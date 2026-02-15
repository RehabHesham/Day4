import HTTPError from "../util/HttpError.js";
import jwt from "jsonwebtoken";

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return next(new HTTPError(401, "no token provided"));

  const token = authHeader.split(" ")[1];
  if (!token) return next(new HTTPError(401, "no token provided"));

  try {
    const payload = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    next(err);
  }
};
