const express = require("express");
const {
  addPrescription,
  getPrescriptionById,
} = require("../controllers/Prescription");

const router = express.Router();

router.route("/").post(addPrescription);

router.route("/:id").get(getPrescriptionById);

module.exports = router;
