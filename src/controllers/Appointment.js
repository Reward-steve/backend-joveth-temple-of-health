const Appointment = require("../models/Records/Appointment");
const Notification = require("../models/Security/Notification");
const Patient = require("../models/UserModels/Patient");
const Doctor = require("../models/UserModels/Doctor");
const Nurse = require("../models/UserModels/Nurse");
const Admin = require("../models/UserModels/Admin");

const {
  AppError,
  catchAsync,
  handleNoResult,
  sendResponse,
  handleNotFound,
} = require("../Utils/reusableFunctions");

const filterQuery = require("../Utils/filterQuery");

// Book an appointment
exports.bookAppointment = catchAsync(async (req, res, next) => {
  const {
    patientId,
    doctorId,
    nurseId,
    appointmentDate,
    timeSlot,
    department,
    reason,
    previousVisit,
    preferredTimeRange,
    translatorRequired,
    healthInsuranceType,
    allergies,
    existingMedicalConditions,
    recentSurgeries,
  } = req.body;

  // Check if patient and doctor exist
  const patient = await Patient.findById(patientId);
  const doctor = await Doctor.findById(doctorId);
  // const nurse = await Nurse.findById(nurseId);
  const admin = await Admin.find({
    adminRole: "SuperAdmin",
  });
  const allAdminId = admin.map((admin) => admin._id);
  if (!patient || !doctor) {
    return next(new AppError("Patient or Doctor not found", 404));
  }

  const newAppointment = await Appointment.create({
    patientId,
    doctorId,
    nurseId: nurseId || null, // Optional
    appointmentDate,
    timeSlot,
    department,
    reason, // Optional
    status: "Pending", // Default
    previousVisit,
    preferredTimeRange,
    translatorRequired,
    healthInsuranceType,
    allergies,
    existingMedicalConditions,
    recentSurgeries,
  });

  // Populate data after creating the appointment
  const populatedAppointment = await Appointment.findById(newAppointment._id)
    .populate("patientId", "name email")
    .populate("doctorId", "name email")
    .populate("nurseId", "name email");

  // Add appointment to patient's record
  patient.appointments.push(populatedAppointment);
  doctor.appointments.push(populatedAppointment);
  await patient.save();
  await doctor.save();

  //Notify Admin
  const notifyAdmin = await Notification.create({
    userId: allAdminId,
    message: "You have a new appointment request",
  });
  // Notify doctor
  const notifyDoctor = await Notification.create({
    userId: doctorId,
    message: "You have a new appointment request",
  });

  // Notify patient
  const notifyPatient = await Notification.create({
    userId: patientId,
    message:
      "Your appointment request is pending, you will receive a notification when it is scheduled.",
  });

  //notify nurse
  if (nurseId) {
    const notifyNurse = await Notification.create({
      userId: nurseId,
      message: "You have been assigned to a new appointment",
    });
    await Notification.findById(notifyNurse._id).populate("userId", "name");
  }

  // Populate notifications

  await Notification.findById(notifyAdmin._id).populate("userId", "name");
  await Notification.findById(notifyPatient._id).populate("userId", "name");
  await Notification.findById(notifyDoctor._id).populate("userId", "name");

  sendResponse(res, 201, "success", "Appointment booked", populatedAppointment);
});

// Get all appointments
exports.getAllAppointments = catchAsync(async (req, res, next) => {
  const appointments = await Appointment.find()
    .populate("patientId", "name email")
    .populate("doctorId", "name email")
    .populate("nurseId", "name email");

  handleNoResult(appointments, "No appointments found", next);

  res.status(200).json({
    status: "success",
    result: appointments.length,
    data: { appointments },
  });
});

// Get appointment by ID
exports.getAppointmentById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const appointment = await Appointment.findById(id)
    .populate("patientId", "name email")
    .populate("doctorId", "name email")
    .populate("nurseId", "name email");

  handleNotFound(appointment, "Invalid ID", next);

  res.status(200).json({
    status: "success",
    appointment,
  });
});

// Update appointment
exports.updateAppointment = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const appointment = await Appointment.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  handleNotFound(appointment, "Appointment not found", next);

  // Send notification
  await Notification.create({
    user: appointment.patientId,
    message:
      appointment.status === "Scheduled"
        ? "Your appointment has been Scheduled"
        : "Your appointment is Completed",
    isRead: true,
  });

  sendResponse(
    res,
    200,
    "success",
    "Appointment updated successfully",
    appointment
  );
});

// Cancel appointment
exports.cancelAppointment = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const appointment = await Appointment.findById(id);

  if (!appointment) {
    return next(new AppError("No appointment found", 404));
  }

  appointment.status = "Canceled";
  await appointment.save(); // Ensure changes are saved

  // Send notification
  await Notification.create({
    user: appointment.patientId,
    message: "Your appointment request has been canceled!",
    isRead: true,
  });

  sendResponse(res, 200, "success", "Appointment canceled", appointment);
});

// Query appointments by status
exports.queryBySort = catchAsync(async (req, res, next) => {
  const status = req.query.sort;

  if (["Pending", "Scheduled", "Completed", "Canceled"].includes(status)) {
    return await filterQuery(req, res, status, next);
  }

  return next(new AppError(`Invalid query request: ${status}`, 404));
});
