const express = require("express");
const {
  sendMessage,
  getMessagesByUser,
  markMessageAsRead,
  deleteChatByUser,
  // getMessage,
} = require("../controllers/Message");
const { Protect } = require("../middleware/protect");

const router = express.Router();

//Send a new message
router.route("/").post(Protect, sendMessage);

//Get a specific message by user's id
router.route("/chat/:id").get(getMessagesByUser).delete(deleteChatByUser);

//Mark a message as read
router.route("/read/:id").patch(markMessageAsRead);

module.exports = router;
