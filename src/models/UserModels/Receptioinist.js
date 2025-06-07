const mongoose = require("mongoose");
const Admin = require("./Admin");

const receptionistSchema = new mongoose.Schema({
  receptionistId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
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
  assignedDate: { type: Date, default: Date.now() },
  assignedUntil: { type: Date, required: true },
});

const Receptionist = Admin.discriminator("Receptionist", receptionistSchema);
module.exports = Receptionist;
