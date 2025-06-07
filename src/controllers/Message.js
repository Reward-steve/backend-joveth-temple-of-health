const Message = require("../models/Security/Message");
const {
  catchAsync,
  handleNoResult,
  handleNotFound,
  AppError,
} = require("../Utils/reusableFunctions");

// ✅ Send a new message
exports.sendMessage = catchAsync(async (req, res, next) => {
  const { senderId, receiverId, message } = req.body;

  const newMessage = await Message.create({
    senderId,
    receiverId,
    message,
  });

  res.status(201).json({
    status: "success",
    message: "Message sent successfully",
    data: { newMessage },
  });
});

// ✅ Get all messages for a specific user
exports.getMessagesByUser = catchAsync(async (req, res, next) => {
  const userId = req.params.id;

  const messages = await Message.find({
    $or: [{ senderId: userId }, { receiverId: userId }],
  })
    .populate("senderId", "name email")
    .populate("receiverId", "name email");

  handleNoResult(messages, "No messages found for this user", next);

  res.status(200).json({
    status: "success",
    message: "Messages retrieved successfully",
    result: messages.length,
    data: messages,
  });
});

// ✅ Mark a message as read
exports.markMessageAsRead = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const updatedMessage = await Message.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  handleNotFound(updatedMessage, "Message not found", next);

  res.status(200).json({
    status: "success",
    message: "Message marked as read",
    data: updatedMessage,
  });
});

exports.deleteChatByUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updateMessage = await Message.findByIdAndDelete(id);

  if (!updateMessage) {
    next(new AppError("No message found for this user", 404));
  }

  res.status(201).json({
    status: "success",
    message: "Message deleted successfully",
  });
});
