const Pharmacist = require("../models/UserModels/Pharmacist");
const { catchAsync, handleNotFound } = require("../Utils/reusableFunctions");

//Get all pharmacist
exports.getAllPharmacist = catchAsync(async (req, res, next) => {
  const pharmacist = await Pharmacist.find({});
  handleNotFound(pharmacist, "No pharmacist found", next);
  res.status(200).json({
    status: "success",
    message: "All Pharmacist retrieved successfully",
    pharmacist,
  });
});

//Get a specific pharmacist
exports.getPharmacistById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const pharmacist = await Pharmacist.findById({ id });

  handleNotFound(pharmacist, `No pharmacist found with id ${id}`, next);
  res.status(200).json({
    status: "success",
    message: "Pharmcist retrieved successfully",
    pharmacist,
  });
});

//Update a specific pharmacist
exports.updatePharmacist = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const pharmacist = await Pharmacist.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  handleNotFound(pharmacist, `No pharmacist found with id ${id}`, next);

  res.status(200).json({
    status: "success",
    message: "Pharmacist updated successfully",
    pharmacist,
  });
});

//Delete a specific pharmacist
exports.deletePharmacist = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const pharmacist = await Pharmacist.findByIdAndDelete({ id });
  handleNotFound(pharmacist, `No pharmacist found with id ${id}`, next);

  res.status(204).json({
    status: "deleted",
    message: "Pharmacist deleted successfully",
  });
});
