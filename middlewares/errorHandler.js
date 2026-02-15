// middlewares/errorHandler.js
const errorHandler = (error, req, res, next) => {
  console.log(error);
  // check comming error to extract data
  let status = error.status || 500;
  let message = error.message || "Internal Server error";
  let errors = error.errors;

  /// check for Validation Error
  if (error.name === "ValidationError") {
    status = 400;
    message = "Validation Error";
    errors = Object.values(error.errors).map((el) => ({
      field: el.path,
      message: el.message,
    }));
  }

  // check for duplicates
  if (error.code === 11000) {
    status = 400;

    console.log(error.keyValue);
    const field = Object.keys(error.keyValue)[0];
    const value = error.keyValue[field];

    message = `${field} with ${value} already exist`;
  }
  
  return res.status(status).json({
    message,
    errors,
  });
};

export default errorHandler;
