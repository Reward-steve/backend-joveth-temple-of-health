const express = require("express");

const {
  Register,
  Login,
  checkAuth,
  forgottenPassword,
  resetPassword,
  updatePassword,
  Logout,
  verifyEmail,
  resendVerificationLink,
} = require("../controllers/Auth");

const {
  getUserById,
  updateUserById,
  deleteUserById,
} = require("../controllers/User");

const { Protect } = require("../middleware/protect");
const { restrict } = require("../middleware/adminAuth");

const router = express.Router();

router.route("/register").post(Register);

router.route("/login").post(Login);

router.route("/check-auth").get(checkAuth);

router.route("/verify-email/:token").get(verifyEmail);

router.route("resend-verification").post(resendVerificationLink);

router.route("/forgotpassword").post(forgottenPassword);

router.route("/reset-password/:token").post(resetPassword);

router.route("/updatepassword").patch(Protect, updatePassword);

router.route("/logout/:id").post(Protect, Logout);

router
  .route("/user/:id")
  .get(getUserById)
  .patch(updateUserById)
  .delete(Protect, restrict("Admin"), deleteUserById);

module.exports = router;
