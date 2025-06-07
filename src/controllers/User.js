const User = require("../models/UserModels/User");
const { AppError } = require("../Utils/reusableFunctions");
const { catchAsync } = require("../Utils/reusableFunctions");

//GET USER BY ID
const getUserById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return next(new AppError("No users found", 404));
  }

  res.status(200).json({
    status: "success",
    result: user.length,
    user,
  });
});

//UPDATE USER BY ID
const updateUserById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: false,
  });

  if (!user) {
    return next(new AppError("user not found", 400));
  }

  res.status(201).json({
    status: "success",
    user,
  });
});

//DELETE USER BY ID
const deleteUserById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);

  if (!user) {
    return next(new AppError(`No user with ID ${id} found`, 404));
  }

  res.status(204).json({
    status: "success",
    message: "user deleted successfully",
  });
});

module.exports = {
  getUserById,
  updateUserById,
  deleteUserById,
};
