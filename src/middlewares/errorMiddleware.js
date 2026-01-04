export default (err, req, res, next) => {
  console.error(err.stack);

  const error = {
    success: false,
    message: err.message || "Server Error",
  };

  if (err.name === "SequelizeValidationError") {
    error.message = "Validation Error";
    error.errors = err.errors.map((e) => e.message);
    return res.status(400).json(error);
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    error.message = "Duplicate field value entered";
    return res.status(400).json(error);
  }

  res.status(err.statusCode || 500).json(error);
};
