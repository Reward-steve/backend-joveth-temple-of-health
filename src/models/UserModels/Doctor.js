const mongoose = require("mongoose");
const User = require("./User");

const doctorSchema = new mongoose.Schema({
  department: {
    type: String,
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
  },
  specialization: {
    type: String,
    required: true,
  },
  experience: {
    type: Number, // Number of years
    required: true,
  },
  qualifications: [String], // List of degrees/certifications
  availability: {
    workSchedules: [
      {
        day: {
          type: String,
          enum: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          required: true,
        },
      },
    ],
    timeSlots: [
      {
        startTime: {
          type: String,
          required: true,
          validate: {
            validator: function (v) {
              return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
            },
            message: (props) => `${props.value} is not a valid time format!`,
          },
        },
        endTime: {
          type: String,
          required: true,
          validate: {
            validator: function (v) {
              return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
            },
            message: (props) => `${props.value} is not a valid time format!`,
          },
        },
      },
    ],
  },
  patients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
    },
  ],
  appointments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
  ],
  salary: {
    amount: Number,
    currency: {
      type: String,
      default: "USD",
    },
  },
});

const Doctor = User.discriminator("Doctor", doctorSchema);
module.exports = Doctor;
