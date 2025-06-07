const express = require("express");
const router = express.Router();

const {
  getAllDoctors,
  getDoctorById,
  getAllDoctorsBySpecialization,
  updateDoctorById,
  deleteDoctorById,
  getDoctorsPatient,
  assignPatientToDoctor,
  unassignPatientFromDoctor,
} = require("../controllers/Doctor");

const { Protect } = require("../middleware/protect");
const { restrict } = require("../middleware/adminAuth");

const { getAllPatients, getPatientById } = require("../controllers/Patient");

// Fetch doctors and their details
router.route("/").get(Protect, restrict("Admin"), getAllDoctors);

router.route("/patients").get(getAllPatients);

router.route("/patientid").get(getPatientById);

router
  .route("/:id")
  .get(getDoctorById)
  .patch(updateDoctorById)
  .delete(deleteDoctorById);

// Fetch doctors by specialization
router
  .route("/specialization/:specialization")
  .get(getAllDoctorsBySpecialization);

router.route("/assign-patient").post(assignPatientToDoctor);
router.route("/doctor-patients").post(getDoctorsPatient);
router.route("/unassign-patient").post(unassignPatientFromDoctor);

module.exports = router;
