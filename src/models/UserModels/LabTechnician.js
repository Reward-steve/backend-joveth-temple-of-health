const mongoose = require("mongoose");
const User = require("./User");

const labTechnicianSchema = new mongoose.Schema({
  department: {
    type: String,
    required: true,
  },
  qualifications: [String],
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
  assignedTests: [{ type: mongoose.Schema.Types.ObjectId, ref: "TestRequest" }],
});

const LabTechnician = User.discriminator("LabTechnician", labTechnicianSchema);
module.exports = LabTechnician;
