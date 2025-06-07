const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
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
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
        },
        message: (props) => `${props.value} is not a valid time format!`,
      },
    },
    department: {
      type: String,
      required: true,
      enum: [
        "General",
        "Surgical",
        "Medical",
        "Emergency",
        "Pediatric",
        "Gynecology",
        "Mental Health",
        "Oncology",
        "Dermatology",
        "Infectious Diseases",
        "Radiology",
        "Pathology",
        "Rehabilitation",
        "Urology",
        "Ophthalmology",
        "Otolaryngology",
      ],
      default: "General",
    },
    preferredDoctorGender: {
      type: String,
      enum: ["male", "female", "any"],
      default: "any",
    },
    previousVisit: { type: Boolean },
    preferredTimeRange: { type: String },
    translatorRequired: { type: Boolean },
    healthInsuranceType: { type: String },
    allergies: { type: [String] },
    existingMedicalConditions: { type: [String] },
    recentSurgeries: { type: [String] },
    medicationReactions: { type: [String] },
    reason: {
      type: String,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ["Pending", "Scheduled", "Completed", "Canceled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;
