const Notification = require("../models/Security/Notification");

const {
  catchAsync,
  handleNotFound,
  sendResponse,
} = require("../Utils/reusableFunctions");

exports.getAllNotification = catchAsync(async (req, res, next) => {
  const notification = await Notification.find({});
  handleNotFound(notification, "No Notification Found", next);

  sendResponse(
    res,
    200,
    "success",
    "All Notifications retrived successfully",
    notification
  );
});

exports.getNotificationByUserId = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const notification = await Notification.find({
    userId: id,
  });

  handleNotFound(notification, `No Notification found with id ${id}`, next);

  let message;
  for (let i = 0; i < notification.length; i++) {
    message = notification[i].message;
  }

  res.status(200).json({
    status: "success",
    Notifications: notification.length,
    message,
  });
});

exports.deleteNotification = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const notification = await Notification.findByIdAndDelete({ id });

  handleNotFound(notification, "Notification Not Found");

  res.status(204).json({
    status: "success",
    message: "Notification deleted successfully",
  });
});
