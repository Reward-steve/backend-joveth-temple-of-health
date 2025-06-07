const User = require("../models/UserModels/User");
const Admin = require("../models/UserModels/Admin");
const Doctor = require("../models/UserModels/Doctor");
const LabTechnician = require("../models/UserModels/LabTechnician");
const Pharmacist = require("../models/UserModels/Pharmacist");
const Nurse = require("../models/UserModels/Nurse");
const Patient = require("../models/UserModels/Patient");

//Helper function to find user by email
const findByEmail = async (email) => {
  return await User.findOne({ email }).select("+password");
};

const findUserById = async (id) => {
  return await User.findById(id).select("+password");
};

// Helper function to create role-specific details
const createRoleSpecificDetails = async (
  role,
  firstname,
  lastname,
  username,
  email,
  password,
  rest
) => {
  switch (role) {
    case "Admin":
      return await Admin.create({
        role,
        firstname,
        lastname,
        username,
        email,
        password,
        ...rest,
      });
    case "Doctor":
      return await Doctor.create({
        role,
        firstname,
        lastname,
        username,
        email,
        password,
        ...rest,
      });
    case "Nurse":
      return await Nurse.create({
        role,
        firstname,
        lastname,
        username,
        email,
        password,
        ...rest,
      });
    case "Patient":
      return await Patient.create({
        role,
        firstname,
        lastname,
        username,
        email,
        password,
        ...rest,
      });
    case "LabTechnician":
      return await LabTechnician.create({
        role,
        firstname,
        lastname,
        username,
        email,
        password,
        ...rest,
      });
    case "Pharmacist":
      return await Pharmacist.create({
        role,
        firstname,
        lastname,
        username,
        email,
        password,
        ...rest,
      });
    default:
      throw new Error(`Invalid role specified ${role}`);
  }
};
module.exports = {
  findByEmail,
  findUserById,
  createRoleSpecificDetails,
};
