const Appointment = require("../models/Records/Appointment");
const { handleNoResult } = require("../Utils/reusableFunctions");

module.exports = fetchAppointments = async (query, res, next, message) => {
  const appointments = await Appointment.find(query);
  handleNoResult(appointments, message, next);

  res.status(200).json({
    status: "success",
    message: "Appointments retrieved successfully",
    result: appointments.length,
    data: { appointments },
  });
};
