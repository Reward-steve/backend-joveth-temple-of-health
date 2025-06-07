const express = require("express");
const {
  createInvoice,
  createPayment,
  getAllInvoice,
  getInvoiceByPatient,
  getPaymentsByPatientsId,
  getPaymentsByInvoice,
} = require("../controllers/Billing");
const router = express.Router();

router.route("/invoice").get(getAllInvoice).post(createInvoice);
router.route("/invoice/:patientId").get(getInvoiceByPatient);

router.route("/payment").post(createPayment);
router.route("/payment/:patientId").get(getPaymentsByPatientsId);
router.route("/payment/:invoiceId").get(getPaymentsByInvoice);

module.exports = router;
