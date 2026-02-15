import User from "../models/User.js";
import HTTPError from "../util/HttpError.js";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  try {
    // get data from request
    const { name, email, password } = req.body;

    // check if user Exist

    // insert user in db
    const user = await User.create({ name, email, password });
    // throw error.code = 11000 duplicate email from mongodb

    return res.status(200).json({
      message: "user created",
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) next(new HTTPError(400, "Invalid email or password"));

    if (!user.comparePassword(password))
      next(new HTTPError(400, "Invalid email or password"));

    // valid email , password => user
    // generate jwt token
    const token = await jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "3d" },
    );

    return res.status(200).json({
      message: "user logged in successfully",
      token,
    });
  } catch (err) {
    next(err);
  }
};
