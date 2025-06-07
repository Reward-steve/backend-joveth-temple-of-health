const express = require("express");
const router = express.Router();

const {
  createMedicalRecord,
  getMedicalRecordsByPatient,
  updateMedicalRecord,
  deleteMedicalRecord,
  getAllMedicalRecord,
} = require("../controllers/MedicalRecords");

const { Protect } = require("../middleware/protect");
const { restrict } = require("../middleware/adminAuth");

router
  .route("/")
  .get(Protect, restrict("Admin", "Doctor", "Nurse"), getAllMedicalRecord)
  .post(Protect, restrict("Doctor"), createMedicalRecord); // ✅ Create a new medical history record

// ✅ Get all medical records for a specific patient
router.route("/:patientId").get(getMedicalRecordsByPatient);

// ✅ Get, update, or delete a specific medical history record by ID
router
  .route("/:id")
  .patch(Protect, restrict("Nurse"), updateMedicalRecord)
  .delete(Protect, restrict("Admin", "Doctor"), deleteMedicalRecord);

module.exports = router;
