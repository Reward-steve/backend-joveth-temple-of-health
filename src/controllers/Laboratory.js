const TestRequest = require("../models/Pharmacy/TestRequest");
const TestResponse = require("../models/Pharmacy/TestResponse");
const Notification = require("../models/Security/Notification");
const Patient = require("../models/UserModels/Patient");
const { catchAsync, handleNotFound } = require("../Utils/reusableFunctions");

//create a new test request
exports.createTestRequest = catchAsync(async (req, res, next) => {
  const { patientId, doctorId, testType } = req.body;

  const patient = await Patient.findById({ patientId });

  handleNotFound(patient, `Patient with id ${patientId} not found`);

  const newTestRequest = await TestRequest.create({
    patientId,
    doctorId,
    testType,
  });

  // Notify the doctor
  await Notification.create({
    user: doctorId,
    message: "Your Test request is pending",
    isRead: true,
  });

  res.status(201).json({
    status: "success",
    message: "Test request created successfully",
    newTestRequest,
  });
});

//Get all request for a specific patient
exports.getTestRequestByPatientId = catchAsync(async (req, res, next) => {
  const { patientId } = req.params.id;
  const testRequest = await TestRequest.findById({ patientId })
    .populate("patientId", "name")
    .populate("doctorId", "name");

  handleNotFound(testRequest, "Test request not found", nexts);

  res.status(200).json({
    status: "success",
    message: "Test request retrieved successfully",
    result: testRequest.length,
    testRequest,
  });
});

//Update test request status
exports.updateTestRequest = catchAsync(async (req, res, next) => {
  const { id } = req.params.id;
  const { status } = req.body;

  const testRequest = await TestRequest.findByIdAndUpdate(id, status, {
    new: true,
    runValidators: true,
  });

  handleNotFound(testRequest, "Test request not found", next);

  res.status(200).json({
    status: "success",
    message: "Test request updated successfully",
    testRequest,
  });
});

//Creat a new test result
exports.createTestResult = catchAsync(async (req, res, nest) => {
  const { labTechnicianId, testRequestId, results, notes } = req.body;

  const testRequest = await TestRequest.findById({ testRequestId });

  handleNotFound(testRequest, "Test request not found", next);

  const testResponse = await TestResponse.create({
    labTechnicianId,
    testRequestId,
    results,
    notes,
  }).populate("labTechnicianId", "name");

  testRequest.status = "Completed";
  await testRequest.save();

  res.status(200).json({
    status: "success",
    testResponse,
  });
});

//Get test result by Id
exports.getTestResultById = catchAsync(async (req, res, next) => {
  const { id } = req.params.id;

  const testResult = await TestResponse.findById({ id })
    .populate("labTechnicianId", "name")
    .populate("patientId", "name");

  handleNotFound(testResult, "Test Result Not Found", next);

  res.status(200).json({
    status: "success",
    message: "Test result retrieved successfully",
    testResult,
  });
});

exports.updateTestResult = catchAsync(async (req, res, next) => {
  const { id } = req.params.id;

  const testResult = await TestResponse.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  handleNotFound(testResult, "Test result not found", next);

  res.status(200).json({
    status: "success",
    message: "Test result updated successfully",
    testResult,
  });
});
