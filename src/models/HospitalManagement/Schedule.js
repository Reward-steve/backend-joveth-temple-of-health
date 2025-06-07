const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
        timeSlots: [
          {
            startTime: {
              type: String,
              required: true,
              validate: {
                validator: function (v) {
                  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
                },
                message: (props) =>
                  `${props.value} is not a valid time format!`,
              },
            },
            endTime: {
              type: String,
              required: true,
              validate: {
                validator: function (v) {
                  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
                },
                message: (props) =>
                  `${props.value} is not a valid time format!`,
              },
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const Schedule = mongoose.model("Schedule", scheduleSchema);
module.exports = Schedule;
