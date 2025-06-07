const express = require("express");
const router = express.Router();

const {
  getNotificationByUserId,
  getAllNotification,
  deleteNotification,
} = require("../controllers/Notification");

router.route("/").get(getAllNotification);
router.route("/:id").get(getNotificationByUserId).delete(deleteNotification);

module.exports = router;
