const Prescription = require("../models/Records/Prescription");
const { catchAsync, handleNotFound } = require("../Utils/reusableFunctions");

// ✅ Add a prescription
exports.addPrescription = catchAsync(async (req, res, next) => {
  const { patientId, doctorId, medicines } = req.body;

  const newPrescription = await Prescription.create({
    patientId,
    doctorId,
    medicines,
  });

  handleNotFound(newPrescription, "Prescription failed", next);

  res.status(201).json({
    status: "success",
    message: "Prescription added successfully",
    data: { newPrescription },
  });
});

// ✅ View a prescription
exports.getPrescriptionById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const prescription = await Prescription.findById(id)
    .populate("patientId", "name")
    .populate("doctorId", "name");

  handleNotFound(prescription, "Prescription not found", next);

  res.status(200).json({
    status: "success",
    message: "Prescription retrieved successfully",
    data: { prescription },
  });
});
