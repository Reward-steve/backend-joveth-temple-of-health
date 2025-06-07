const mongoose = require("mongoose");

const {
  PreSave,
  createPasswordResetToken,
  changedPasswordAfter,
  comparePassword,
} = require("../../Utils/SchemaMethods");

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, "First Name is require"],
    },
    lastname: {
      type: String,
      required: [true, "lastname is require"],
    },
    username: { type: String, required: [true, "Username is required"] },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "A password is required"],
      minlength: [8, "A password must have more than or equal to 8 characters"],
      maxlength: [
        60,
        "A password must have less than or equal to 60 characters",
      ],
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationExp: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
    lastVerificationSent: { type: Date },
    profilePicture: { type: String },
    role: {
      type: String,
      enum: [
        "Admin",
        "Doctor",
        "Patient",
        "Nurse",
        "Labtechnician",
        "Pharmacist",
      ],
      default: "Patient",
    },

    passwordChangedAt: Date,
    passwordResetToken: String,
    tokenExp: Date,
  },
  { timeseries: true }
);

userSchema.pre("save", PreSave);
userSchema.methods.changedPasswordAfter = changedPasswordAfter;
userSchema.methods.createPasswordResetToken = createPasswordResetToken;
userSchema.methods.comparePassword = comparePassword;

const User = mongoose.model("User", userSchema);
module.exports = User;
