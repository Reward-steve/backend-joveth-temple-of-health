const mongoose = require("mongoose");

const TestResponseSchema = new mongoose.Schema(
  {
    testRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TestRequest",
      required: true,
    },
    labTechnicianId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LabTechnician",
      required: true,
    },
    results: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

const TestResponse = mongoose.model("TestResponse", TestResponseSchema);
module.exports = TestResponse;
/*

Example Usage
Creating a Test Response: When a lab technician processes a test request and obtains the results, a new test response document is created and saved in the database.
Retrieving Test Responses: The application can query the TestResponse collection to retrieve all test responses for a specific test request or processed by a specific lab technician.
Displaying Test Results: The application can display the details of a test response, including the results and any additional notes, in the patient's medical records.


*/
