const Doctor = require("../models/UserModels/Doctor.js");
const Patient = require("../models/UserModels/Patient.js");

const {
  catchAsync,
  AppError,
  handleNotFound,
  handleNoResult,
} = require("../Utils/reusableFunctions.js");

exports.getAllDoctors = catchAsync(async (req, res, next) => {
  const doctors = await Doctor.find({});

  if (doctors.length === 0) {
    return next(new AppError("No doctors found", 200));
  }

  res.status(200).json({
    status: "success",
    result: doctors.length,
    data: { doctors },
  });
});

exports.getDoctorById = catchAsync(async (req, res, next) => {
  const doctor = await Doctor.findById(req.params.id);
  handleNotFound(doctor, `No doctor with ID ${req.params.id} found.`, next);

  res.status(200).json({
    status: "success",
    data: { doctor },
  });
});

exports.getAllDoctorsBySpecialization = catchAsync(async (req, res, next) => {
  const doctors = await Doctor.find({
    specialization: req.params.specialization,
  });

  handleNoResult(doctors, "No doctors found with this specialization", next);

  res.status(200).json({
    status: "success",
    result: doctors.length,
    data: { doctors },
  });
});

exports.updateDoctorById = catchAsync(async (req, res, next) => {
  const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  handleNotFound(doctor, `No doctor with ID ${req.params.id} found.`, next);

  res.status(200).json({
    status: "success",
    message: "Doctor updated successfully",
    data: { doctor },
  });
});

exports.assignPatientToDoctor = catchAsync(async (req, res, next) => {
  const { patientId, doctorId } = req.body;
  const patient = await Patient.findById(patientId);
  const doctor = await Doctor.findByIdAndUpdate(
    doctorId,
    { $push: { patients: patient._id } },
    { new: true }
  ).populate("patients", "name");

  handleNotFound(doctor, `No doctor with ID ${doctorId} found.`, next);
  handleNotFound(patient, `No patient with ID ${patientId} found.`, next);

  res.status(200).json({
    status: "success",
    message: "Patient assigned to doctor successfully",
    doctor,
  });
});

exports.getDoctorsPatient = catchAsync(async (req, res, next) => {
  const { doctorId } = req.body;
  const doctor = await Doctor.findById(doctorId).populate("patients", "name");

  handleNotFound(doctor, `No doctor with ID ${doctorId} found.`, next);

  res.status(200).json({
    status: "success",
    message: "Doctor patients",
    patients: doctor.patients,
  });
});

exports.unassignPatientFromDoctor = catchAsync(async (req, res, next) => {
  const { patientId, doctorId } = req.body;
  const doctor = await Doctor.findByIdAndUpdate(
    doctorId,
    { $pull: { patients: patientId } },
    { new: true }
  ).populate("patients");

  handleNotFound(doctor, `No doctor with ID ${doctorId} found.`, next);

  res.status(200).json({
    status: "success",
    message: "Patient unassigned from doctor successfully",
    doctor,
  });
});

exports.deleteDoctorById = catchAsync(async (req, res, next) => {
  const doctor = await Doctor.findByIdAndDelete(req.params.id);
  console.log(req.params.id);

  handleNotFound(doctor, `No Doctor found with id ${req.params.id}`, next);

  res.status(204).json({
    status: "success",
    message: "Doctor deleted successfully",
  });
});
