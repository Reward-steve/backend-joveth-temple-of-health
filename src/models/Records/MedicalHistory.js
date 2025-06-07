const mongoose = require("mongoose");

const medicalHistorySchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  nurseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Nurse",
    required: true,
  },
  diagnosis: {
    type: String,
    required: true,
  },
  medicalHistory: {
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    allergies: [String],
    pastDiseases: [String],
  },
  treatments: [String],
  medications: [String],
  status: {
    type: String,
    enum: ["Ongoing", "Recovered", "Critical", "Deceased"],
    default: "Ongoing",
  },
  visitDate: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ✅ Indexing for faster queries
medicalHistorySchema.index({ patientId: 1, doctorId: 1 });

const MedicalHistory = mongoose.model("MedicalHistory", medicalHistorySchema);
module.exports = MedicalHistory;
