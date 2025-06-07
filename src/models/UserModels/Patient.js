const mongoose = require("mongoose");
const User = require("./User");

const patientSchema = new mongoose.Schema({
  dateOfBirth: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female"],
    required: true,
  },
  address: {
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    street: { type: String, required: true },
  },
  emergencyContact: {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    relationship: {
      required: true,
      type: String,
      enum: ["Parent", "Sibling", "Spouse", "Friend", "Other"],
    },
  },
  insuranceId: { type: mongoose.Schema.Types.ObjectId, ref: "Insurance" },
  patientID: {
    type: Number,
  },
  medicalHistory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MedicalHistory",
    },
  ],
  appointments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
  ],
  prescriptions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prescription",
    },
  ],
});

const Patient = User.discriminator("Patient", patientSchema);
module.exports = Patient;
