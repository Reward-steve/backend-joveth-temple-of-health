const User = require("../models/UserModels/User");
const Admin = require("../models/UserModels/Admin");
const Doctor = require("../models/UserModels/Doctor");
const LabTechnician = require("../models/UserModels/LabTechnician");
const Pharmacist = require("../models/UserModels/Pharmacist");
const Nurse = require("../models/UserModels/Nurse");
const Patient = require("../models/UserModels/Patient");
const Appointment = require("../models/Records/Appointment");

const {
  catchAsync,
  handleNotFound,
  sendResponse,
} = require("../Utils/reusableFunctions");

exports.getAllAdmins = catchAsync(async (req, res, next) => {
  const admin = await Admin.find({});

  handleNotFound(admin, "Admin Not Found", next);

  res.status(200).json({
    status: "success",
    result: admin.length,
    admin,
  });
});

exports.getAdminById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const admin = await Admin.findById({ id });

  handleNotFound(admin, "Admin Not Found", next);

  res.status(200).json({
    status: "success",
    admin,
  });
});

exports.updateAdmin = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const admin = await Admin.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  handleNotFound(admin, "Admin Not Found", next);

  res.status(200).json({
    status: "success",
    message: "Admin updated successfully",
  });
});

exports.deleteAdmin = catchAsync(async (req, res, next) => {
  const admin = await Admin.findByIdAndDelete(req.params.id);
  handleNotFound(admin, "Admin Not Found", next);
  res.status(204).json({
    status: "success",
    message: "Admin delete successfully",
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({});
  const admin = await Admin.find({});
  const doctor = await Doctor.find({});
  const nurse = await Nurse.find({});
  const pharmacist = await Pharmacist.find({});
  const labTechnician = await LabTechnician.find({});
  const patient = await Patient.find({});
  const appointment = await Appointment.find({});

  res.status(200).json({
    status: "success",
    message: "All users statistic retrieved successfully",
    stats: {
      admins: admin.length,
      doctors: doctor.length,
      nurses: nurse.length,
      pharmacists: pharmacist.length,
      labtechnicians: labTechnician.length,
      patients: patient.length,
      appointments: appointment.length,
      allSignedIn: users.length,
    },
    data: {
      doctors: doctor.length === 0 ? "No doctor found" : doctor,
      nurses: nurse.length === 0 ? "No nurse found" : nurse,
      pharmacists: pharmacist.length === 0 ? "No pharmacist found" : pharmacist,
      labTechnicians:
        labTechnician.length === 0 ? "No labtechnician found" : labTechnician,
      patients: patient.length === 0 ? "No patient found" : patient,
      appointments:
        appointment.length === 0 ? "No appointment found" : appointment,
    },
  });
});

exports.deleteUserById = catchAsync(async (req, res, next) => {
  const { id } = req.params.id;
  const user = User.findByIdAndDelete(id);
  handleNotFound(user, "User not found", 404);

  sendResponse(res, 204, "success", "user deleted successfully");
});
