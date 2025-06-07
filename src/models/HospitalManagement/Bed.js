const mongoose = require("mongoose");
const Room = require("./Room");

const BedSchema = new mongoose.Schema({
  bedNumber: { type: String, required: true, unique: true }, // Unique bed identifier
  ward: { type: String, required: true }, // Ward where the bed is located
  roomNumber: { type: String, required: true }, // Room number within the ward
  type: {
    type: String,
    enum: ["General", "ICU", "Emergency", "Maternity", "Pediatric"],
    required: true,
  }, // Type of bed
  status: {
    type: String,
    enum: ["Available", "Occupied", "Under Maintenance"],
    default: "Available",
  }, // Availability status
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    default: null,
  }, // Assigned patient
  assignedDate: { type: Date, default: null }, // Date when a patient was assigned
  releaseDate: { type: Date, default: null }, // Expected or actual release date
});

module.exports = mongoose.model("Bed", BedSchema);

// Automatically update room availability
BedSchema.post("save", async function () {
  const room = await Room.findById(this.roomId);
  const occupiedBeds = await mongoose.model("Bed").countDocuments({
    roomId: this.roomId,
    status: "Occupied",
  });
  room.availableBeds = room.totalBeds - occupiedBeds;
  await room.save();
});
