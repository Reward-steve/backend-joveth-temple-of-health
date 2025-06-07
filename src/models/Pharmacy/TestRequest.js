const mongoose = require("mongoose");

const testRequestSchema = new mongoose.Schema(
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
    testType: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed", "Canceled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const TestRequest = mongoose.model("TestRequest", testRequestSchema);
module.exports = TestRequest;

/*
Example Usage
Creating a Test Request: When a doctor requests a laboratory test for a patient, a new test request document is created and saved in the database.
Retrieving Test Requests: The application can query the TestRequest collection to retrieve all test requests for a specific patient or requested by a specific doctor.
Updating Test Status: The application can update the status of a test request (e.g., from "Pending" to "In Progress" or "Completed") and add the test results once available.
*/
