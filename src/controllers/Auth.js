const User = require("../models/UserModels/User");
const jwt = require("jsonwebtoken");

const {
  AppError,
  catchAsync,
  hashedToken,
  handleNotFound,
  CreateSendToken,
  sendResponse,
} = require("../Utils/reusableFunctions.js");

const {
  sendVerificationEmail,
  sendResetPasswordEmail,
} = require("../mail/sendEmail.js");

const {
  findByEmail,
  findUserById,
  createRoleSpecificDetails,
} = require("../Utils/roleAuth.js");

// REGISTER OR SIGNUP
const Register = catchAsync(async (req, res, next) => {
  const {
    firstname,
    lastname,
    username,
    email,
    password,
    role = "Patient", // Default role
    ...rest
  } = req.body;

  // 1. Validate required fields
  if (!firstname || !lastname || !username || !email || !password) {
    return next(new AppError("All fields are required", 400));
  }

  // 2. Check if email already exists
  const existingUser = await findByEmail(email);
  if (existingUser) {
    return next(new AppError("Email already in use", 400));
  }

  // 3. Create new user with role-specific details
  const newUser = await createRoleSpecificDetails(
    role,
    firstname,
    lastname,
    username,
    email,
    password,
    rest
  );

  if (!newUser) {
    return next(new AppError("User creation failed", 500));
  }

  await sendVerificationEmail(newUser, email);

  // 5. Success response
  res.status(201).json({
    status: "success",
    message: "Registration successful, please verify your email address",
  });
});

// VERIFY USER ACCOUNT
const verifyEmail = catchAsync(async (req, res, next) => {
  const { token } = req.params;

  if (!token || typeof token !== "string") {
    return next(new AppError("Invalid or missing token", 400));
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  // Ensure decoded token contains user ID
  if (!decoded || typeof decoded !== "object" || !("id" in decoded)) {
    return next(new AppError("Invalid token payload", 400));
  }

  const userId = decoded.id;

  // Find user by ID from token payload
  const user = await User.findById(userId);

  if (!user) {
    return next(new AppError("User no longer exists", 404));
  }

  if (user.isVerified) {
    return res.status(200).json({
      status: "success",
      message: "Email already verified. You can now log in.",
    });
  }

  // Mark email as verified
  user.isVerified = true;
  user.verificationExp = undefined;

  await user.save({ validateBeforeSave: false });

  // Automatically log them in after verification
  CreateSendToken(user, res);
});

// RESEND VERIFICATION LINK
const resendVerificationLink = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError("Email is required", 400));
  }

  const user = await findByEmail(email.trim().toLowerCase());
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  if (user.isVerified) {
    return res.status(200).json({ message: "Email already verified" });
  }

  const ONE_MINUTE = 60 * 1000;
  const now = Date.now();

  if (
    user.lastVerificationSent &&
    now - user.lastVerificationSent < ONE_MINUTE
  ) {
    const waitTime = Math.ceil(
      (ONE_MINUTE - (now - user.lastVerificationSent)) / 1000
    );
    return next(
      new AppError(`Please wait ${waitTime} seconds before retrying`, 429)
    );
  }

  user.lastVerificationSent = now;
  await user.save({ validateBeforeSave: false });

  await sendVerificationEmail(user, user.email);

  return res.status(200).json({
    message: "Verification email has been resent",
  });
});

//CHECK-AUTH
const checkAuth = catchAsync(async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return next(new AppError("Invalid or missing token", 400));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Find user by ID from token payload
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new AppError("User not found", 404));
    }
    CreateSendToken(user, res);
  } catch (err) {
    return next(new AppError("Session expired or token invalid", 401));
  }
});

// LOGIN OR SIGNIN
const Login = catchAsync(async (req, res, next) => {
  let { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return next(new AppError("Email and password are required", 400));
  }

  // Normalize email
  email = email.trim().toLowerCase();

  // Find user by email
  const user = await findByEmail(email);
  if (!user) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // Check email verification
  if (!user.isVerified) {
    return next(new AppError("Please verify your email address", 403));
  }

  // Success - send token
  CreateSendToken(user, res);
});

//FORGOTTEN PASSWORD
const forgottenPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError("Please provide an email address", 400));
  }

  const user = await findByEmail(email);
  handleNotFound(user, `No user found with email: ${email}`, next);

  // Generate reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  await sendResetPasswordEmail(resetToken, user.username, email);

  res.status(200).json({
    status: "success",
    message: "A reset password link has been sent to your email",
  });
});

const resetPassword = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!token) return next(new AppError("Reset token is required", 400));
  if (!password) return next(new AppError("New password is required", 400));

  const encryptedToken = hashedToken(token);

  const user = await User.findOne({ passwordResetToken: encryptedToken });

  if (!user) {
    return next(
      new AppError(
        "Failed to reset password. Token is invalid or expired.",
        400
      )
    );
  }

  const isExpired =
    user.tokenExp instanceof Date
      ? user.tokenExp.getTime() < Date.now()
      : user.tokenExp < Date.now();

  if (!user.tokenExp || isExpired) {
    return next(
      new AppError(
        "Failed to reset password. Token is invalid or expired.",
        400
      )
    );
  }

  user.password = password;
  user.passwordChangedAt = Date.now();
  user.passwordResetToken = undefined;
  user.tokenExp = undefined;

  try {
    await user.save({ validateBeforeSave: false });
  } catch (err) {
    return next(new AppError("Failed to update password. " + err.message, 500));
  }
  res.status(200).json({
    status: "success",
    message: "Password reset successful. You can now log in.",
  });
});

const updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, password } = req.body;
  //get user id
  const { id } = req.user;

  if (!currentPassword || !password) {
    return next(new AppError("All fields are require", 500));
  }

  //get user from collection
  const user = await findUserById(id);

  const isMatch = await user.comparePassword(currentPassword, user.password);

  if (!user || !isMatch) {
    return next(new AppError("Your current password is wrong.", 400));
  }

  user.password = password;
  await user.save();

  sendResponse(res, 200, "success", "password updated successfully", user);
});

const Logout = catchAsync(async (req, res, next) => {
  const { id } = req.user;

  const currentUser = await findUserById(id);

  if (!currentUser) {
    next(new AppError("User not found", 404));
  }

  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    expires: new Date(0),
  });

  sendResponse(res, 200, "success", "successfully logged out");
});

module.exports = {
  Register,
  Login,
  verifyEmail,
  resendVerificationLink,
  checkAuth,
  forgottenPassword,
  resetPassword,
  updatePassword,
  Logout,
};
