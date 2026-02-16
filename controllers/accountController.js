import User from "../models/User.js";
import HTTPError from "../util/HttpError.js";
import jwt from "jsonwebtoken";
import RefreshToken from "../models/refreshToken.js";
import bcrypt from "bcryptjs";

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
    const accesstoken = await jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1m" },
    );

    const refreshToken = await jwt.sign(
      {
        userId: user._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "7d",
      },
    );

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await RefreshToken.create({
      user: user._id,
      token: hashedRefreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 100,
      })
      .json({
        message: "user logged in successfully",
        accesstoken,
      });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  // black list for tokens with expire date  => access token only

  // access token + refresh token
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return next(new HTTPError(400, "Refresh token required"));

    let payload;
    try {
      payload = await jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
      );
    } catch (err) {
      return next(new HTTPError(401, "invalid refresh token"));
    }
    const userTokens = await RefreshToken.find({ user: payload.userId });

    // find will run callback for each token sync
    // async  => promises
    // promise.all()

    console.log(userTokens);
    const comparisons = await Promise.all(
      userTokens.map((t) => {
        return bcrypt.compare(refreshToken, t.token);
      }),
    );
    console.log(comparisons);
    const matchedIndex = comparisons.findIndex((match) => match == true);

    if (matchedIndex === -1)
      return next(new HTTPError(401, "Refresh token not found"));

    await RefreshToken.findByIdAndDelete(userTokens[matchedIndex]._id);

    return res
      .clearCookie("refreshToken", { httpOnly: true, sameSite: "strict" })
      .json({
        message: "Logged out successfully",
      });
  } catch (err) {
    next(err);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return next(new HTTPError(400, "Refresh token required"));

    let payload;
    try {
      payload = await jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
      );
    } catch (err) {
      return next(new HTTPError(401, "invalid refresh token"));
    }

    const userTokens = await RefreshToken.find({ user: payload.userId });

    // find will run callback for each token sync
    // async  => promises
    // promise.all()

    console.log(userTokens);
    const comparisons = await Promise.all(
      userTokens.map((t) => {
        return bcrypt.compare(refreshToken, t.token);
      }),
    );
    console.log(comparisons);
    const matchedIndex = comparisons.findIndex((match) => match == true);

    if (matchedIndex === -1)
      return next(new HTTPError(401, "Refresh token not found"));

    const user = await User.findById(payload.userId);
    const newAccessToken = await jwt.sign(
      {
        userId: payload.userId,
        role: user.role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      },
    );

    return res.status(200).json({
      accesstoken: newAccessToken,
    });
  } catch (err) {
    next(err);
  }
};
