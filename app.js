const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { AppError } = require("./src/Utils/reusableFunctions.js");
const errorHandler = require("./src/middleware/errorHandler.js");

const Auth = require("./src/routes/Auth.js");
const Admin = require("./src/routes/Admin.js");
const Doctor = require("./src/routes/Doctor.js");
const Patient = require("./src/routes/Patient.js");
const Appointment = require("./src/routes/Appointment.js");
const MedicalRecord = require("./src/routes/MedicalRecord.js");
const Lab = require("./src/routes/Lab.js");
const Pharmacy = require("./src/routes/Pharmacy.js");
const Pharmacist = require("./src/routes/Pharmacist.js");
const Prescription = require("./src/routes/Prescription.js");
const Billing = require("./src/routes/Billing.js");
const Notification = require("./src/routes/Notification.js");
const Message = require("./src/routes/Message.js");
const Profile = require("./src/routes/Profile.js");
const User = require("./src/models/UserModels/User.js");

const app = express();
app.use(express.json());

app.use(cookieParser());

const corsOptionsDelegate = (req, callback) => {
  let corsOption;
  const origin = req.header("Origin");

  if (origin && origin.startsWith("http://localhost")) {
    corsOption = { origin: origin, credentials: true };
  } else {
    corsOption = { origin: false };
  }
  callback(null, corsOption);
};

const deleteUnverifiedUser = async () => {
  try {
    const result = await User.deleteMany({
      isVerified: false,
      verificationExp: { $lte: Date.now() },
    });
    if (result.deletedCount > 0) {
      console.log(`🧹 Deleted ${result.deletedCount} unverified user(s)`);
    }
  } catch (err) {
    console.error("Failed to delete unverified users:", err);
  }
};

// deleteUnverifiedUser()

const oneDay = 24 * 60 * 60 * 1000;
setInterval(deleteUnverifiedUser, oneDay);

app.use(cors(corsOptionsDelegate));

app.options("*", cors());

app.use("/api/v1/auth", Auth);
app.use("/api/v1/admin", Admin);
app.use("/api/v1/doctors", Doctor);
app.use("/api/v1/patients", Patient);
app.use("/api/v1/pharmacist", Pharmacist);
app.use("/api/v1/pharmacy", Pharmacy);
app.use("/api/v1/prescription", Prescription);
app.use("/api/v1/lab-tests", Lab);
app.use("/api/v1/billing", Billing);
app.use("/api/v1/records", MedicalRecord);
app.use("/api/v1/appointments", Appointment);
app.use("/api/v1/notification", Notification);
app.use("/api/v1/message", Message);
app.use("/api/v1/profile", Profile);

app.all("*", (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on server`, 404));
});

app.use(errorHandler);
app.use((err, req, res, next) => {
  console.error("ERROR:", err);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
