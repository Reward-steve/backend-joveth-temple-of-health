const { AppError } = require("../Utils/reusableFunctions");

const handleValidatorErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalide Input data: ${errors.join(" . ")}`;
  return new AppError(message, 400);
};

const handleTokenExpiredError = () => {
  return new AppError("Your token has expired! Please log in again", 401);
};

const handleJWTError = () => {
  return new AppError("Invalid token. Please log in again!", 401);
};

// const handleTypeError = () => {
//   return new AppError("Invalid email or password", 401);
// };

const SendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const SendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming or other unknown error: don't leak error details
    // 1) Log error
    console.error("ERROR 💥", err);

    // 2) Send generic message
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    // if (err.name === "TypeError") err = handleTypeError();
    SendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    if (err.name === "ValidationError") err = handleValidatorErrorDB(err);

    if (err.name === "TokenExpiredError") err = handleTokenExpiredError();

    if (err.name === "JsonWebTokenError") err = handleJWTError();

    // if (err.name === "TypeError") err = handleTypeError();
    SendErrorProd(err, res);
  }
};
