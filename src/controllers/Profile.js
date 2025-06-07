const User = require("../models/UserModels/User");
const {
  catchAsync,
  AppError,
  handleNotFound,
} = require("../Utils/reusableFunctions");

//Upload profile picture
exports.uploadProfilePicture = catchAsync(async (req, res, next) => {
  const { id } = req.user;

  if (!req.file) {
    return next(new AppError("Please upload a file", 400));
  }

  const user = await User.findByIdAndUpdate(
    id,
    { profilePicture: req.file.path },
    { new: true, runValidators: true }
  );
  handleNotFound(user, "No user found with this id", next);

  res.status(200).json({
    status: "success",
    message: "Profile picture uploaded successfully",
    user,
  });
});
