const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true },
  type: {
    type: String,
    enum: ["General", "ICU", "Maternity", "Private"],
    required: true,
  },
  totalBeds: { type: Number, required: true },
  availableBeds: {
    type: Number,
    required: true,
    default: function () {
      return this.totalBeds;
    },
  },
});
module.exports = mongoose.model("Room", RoomSchema);
