const mongoose = require("mongoose");
const User = require("./User");

const adminSchema = new mongoose.Schema({
  adminRole: {
    type: String,
    enum: ["SuperAdmin", "HOD", "Receptionist"],
    required: true,
  },
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

const Admin = User.discriminator("Admin", adminSchema);
module.exports = Admin;
