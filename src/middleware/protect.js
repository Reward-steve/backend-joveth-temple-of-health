const { promisify } = require("node:util");
const jwt = require("jsonwebtoken");

const User = require("../models/UserModels/User.js");

const { AppError, catchAsync } = require("../Utils/reusableFunctions.js");

//Protected middleware to allow access to only authorized users
exports.Protect = catchAsync(async (req, res, next) => {
  const authToken = req.cookies.token;
  // Extract token from Authorization header

  //check if token is found
  if (!authToken) {
    return next(
      new AppError("You are not logged in. Please login to get access", 401)
    );
  }

  // verify token
  const decoded = await promisify(jwt.verify)(
    authToken,
    process.env.JWT_SECRET
  );

  // Find user in any role-based collection
  const currentUser = await User.findById(decoded.id);

  if (!currentUser)
    return next(
      new AppError("The User belonging to this token does not exist", 401)
    );

  // check if user changed password after token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please login again", 401)
    );
  }

  // grant access to protected route
  req.user = currentUser;
  next();
});
