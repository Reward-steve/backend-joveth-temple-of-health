const express = require("express");
const router = express.Router();

const {
  getAllPatients,
  getPatientById,
  updatePatientById,
  deletePatientById,
} = require("../controllers/Patient");

const { Protect } = require("../middleware/protect");
const { restrict } = require("../middleware/adminAuth");

router.route("/").get(Protect, getAllPatients);

router
  .route("/:id")
  .get(getPatientById)
  .patch(updatePatientById)
  .delete(Protect, restrict("admin"), deletePatientById);

module.exports = router;
