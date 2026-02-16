import HTTPError from "../util/HttpError.js";

export default (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new HTTPError(403, "Forbidden: you can't do this operation"));

    next();
  };
};
