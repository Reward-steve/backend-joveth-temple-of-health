const nodemailer = require("nodemailer");
const { verifyEmailTemplate } = require("./template/verifyEmailTemplate");
const { SignToken } = require("../Utils/reusableFunctions");
const resetPassword = require("./template/resetPassword");

const isProduction = process.env.NODE_ENV === "production";

// Create email transporter dynamically
const transporter = isProduction
  ? nodemailer.createTransport({
      host: process.env.HOST,
      secure: process.env.SECURE === "true",
      port: Number(process.env.PORT),
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    })
  : nodemailer.createTransport({
      host: "localhost",
      port: 1025,
      secure: false,
    });

const sendVerificationEmail = async (user, email) => {
  try {
    const token = SignToken(user._id);
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
    const html = verifyEmailTemplate(user.username, verificationUrl);

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: "Verify Email",
      html,
    });
  } catch (error) {
    console.error("Error sending user verification email", error);
  }
};

const sendResetPasswordEmail = async (resetToken, username, email) => {
  try {
    const resetURL = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
    const html = resetPassword(resetURL, username);

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: "Reset Password",
      html,
    });
  } catch (error) {
    console.error("Error sending user reset password email", error);
  }
};

module.exports = { sendVerificationEmail, sendResetPasswordEmail };
