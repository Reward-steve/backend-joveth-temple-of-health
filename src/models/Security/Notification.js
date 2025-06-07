const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model (can be generalized to any user)
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
); // Automatically adds createdAt and updatedAt fields

const Notification = mongoose.model("Notification", NotificationSchema);
module.exports = Notification;
