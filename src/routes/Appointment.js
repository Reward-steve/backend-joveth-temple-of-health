const express = require("express");

const {
  bookAppointment,
  getAllAppointments,
  queryBySort,
  updateAppointment,
  getAppointmentById,
  cancelAppointment,
} = require("../controllers/Appointment");

const { Protect } = require("../middleware/protect");
const { restrict, authorize } = require("../middleware/adminAuth");

const router = express.Router();

router
  .route("/")
  .get(
    Protect,
    restrict("Admin"),
    authorize(["manage_appointments"]),
    getAllAppointments
  );

router.route("/filter").get(queryBySort);

router.route("/book-appointment").post(
  Protect,
  restrict("Admin", "Patient"),

  bookAppointment
);

router
  .route("/:id")
  .get(getAppointmentById)
  .patch(updateAppointment)
  .delete(cancelAppointment);

module.exports = router;
