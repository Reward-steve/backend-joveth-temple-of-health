const validate = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const { AppError, hashedToken } = require("../Utils/reusableFunctions");

const PreSave = async function (next) {
  try {
    // Ensure email is defined before validation
    if (!this.email) {
      return next(new AppError("Email is required", 400));
    }

    // Validate Email Address
    if (!validate.isEmail(this.email)) {
      return next(new AppError("Invalid Email Address", 400));
    }

    // Only hash the password if it was modified
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 10);
    }

    next();
  } catch (err) {
    next(err);
  }
};

const changedPasswordAfter = function (timestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return timestamp < changedTimestamp;
  }
};

const createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = hashedToken(resetToken);

  // Set token to expire in 10 minutes
  this.tokenExp = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = {
  PreSave,
  changedPasswordAfter,
  createPasswordResetToken,
  comparePassword,
};
