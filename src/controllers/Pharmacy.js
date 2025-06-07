const Order = require("../models/Pharmacy/Order");
const Medicine = require("../models/Pharmacy/Medicine");
const Notification = require("../models/Security/Notification");
const {
  catchAsync,
  handleNoResult,
  handleNotFound,
} = require("../Utils/reusableFunctions");

// ✅ Order medicine
exports.orderMedicine = catchAsync(async (req, res, next) => {
  const { patientId, medicines } = req.body;

  const newOrder = await Order.create({
    patientId,
    medicines,
  });

  const populateNewOrder = await newOrder.populate("patientId", "name");
  await newOrder.save();

  handleNotFound(newOrder, "Medicine order failed", next);

  await Notification.create({
    userId: patientId,
    message: "Your medicine order has been placed successfully",
    isRead: true,
  });

  res.status(201).json({
    status: "success",
    message: "Medicine order placed successfully",
    data: populateNewOrder,
  });
});

// ✅ Get available medicines
exports.getAvailableMedicines = catchAsync(async (req, res, next) => {
  const medicines = await Medicine.find({});
  handleNoResult(medicines, "No medicines found", next);
  res.status(200).json({
    status: "success",
    result: medicines.length,
    data: { medicines },
  });
});
