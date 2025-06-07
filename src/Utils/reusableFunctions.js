const jwt = require("jsonwebtoken");
const crypto = require("crypto");
// const roles = require("../config/roles");

//APPERROR CLASS
class AppError extends Error {
  constructor(msg, statusCode) {
    super(msg);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "failed" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

//CATCHASYNC
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};

//HASHED TOKEN
const hashedToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

//HANDLE NO RESULT
const handleNoResult = (results, message, next) => {
  if (results.length === 0) {
    return next(new AppError(message, 404));
  }
};

//HANDLE NOT FOUND
const handleNotFound = (data, message, next) => {
  if (!data) {
    return next(new AppError(message, 404));
  }
};

//SIGN TOKEN
const SignToken = (ID) => {
  return jwt.sign({ id: ID }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const CreateSendToken = async (user, res) => {
  try {
    const token = SignToken(user._id.toString());
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    const { _id, firstname, lastname, username, email, role } = user;

    res.status(200).json({
      status: "success",
      user: { _id, firstname, lastname, username, email, role },
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: error.message || "Something went wrong",
    });
  }
};

//OK RESPONSE

const sendResponse = (res, statusCode, status, message, data) => {
  return res.status(statusCode).json({
    status,
    message,
    data,
  });
};

module.exports = {
  AppError,
  catchAsync,
  hashedToken,
  SignToken,
  handleNoResult,
  handleNotFound,
  CreateSendToken,
  sendResponse,
};
