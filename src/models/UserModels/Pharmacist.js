const mongoose = require("mongoose");
const User = require("./User");

const pharmacistSchema = new mongoose.Schema({
  licenseNumber: {
    type: String,
    required: true,
  },
  qualifications: [String], // List of degrees/certifications
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
});

const Pharmacist = User.discriminator("Pharmacist", pharmacistSchema);
module.exports = Pharmacist;
