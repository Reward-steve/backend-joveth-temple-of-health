const Patient = require("../models/UserModels/Patient");

const {
  catchAsync,
  handleNoResult,
  handleNotFound,
  sendResponse,
} = require("../Utils/reusableFunctions");

exports.getAllPatients = catchAsync(async (req, res, next) => {
  const patients = await Patient.find();

  handleNoResult(patients, "No patients found", next);

  res.status(200).json({
    status: "success",
    result: patients.length,
    data: {
      patients,
    },
  });
});

exports.getPatientById = catchAsync(async (req, res, next) => {
  const { patientId } = req.body;
  const patient = await Patient.findOne({ patientId });
  handleNotFound(patient, `No patient with ID ${patientId} found`, next);

  sendResponse(res, 200, "success", "patient retrieved successfully", patient);
});

exports.updatePatientById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const patient = await Patient.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  handleNotFound(patient, `No patient with ID ${id} found`, next);

  res.status(200).json({
    status: "success",
    message: "Patient updated successfully",
    data: {
      patient,
    },
  });
});

exports.deletePatientById = catchAsync(async (req, res, next) => {
  const patient = await Patient.find(req.params.id);
  handleNotFound(patient, `No patient with ID ${req.params.id} found`, next);

  sendResponse(res, 204, "success", "Patient deleted successfully");
});
