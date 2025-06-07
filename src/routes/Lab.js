const express = require("express");
const {
  createTestRequest,
  getTestResultById,
  updateTestResult,
  getTestRequestByPatientId,
  updateTestRequest,
  createTestResult,
} = require("../controllers/Laboratory");
const router = express.Router();

router.route("/test-request").post(createTestRequest);

router
  .route("/test-request/:id")
  .get(getTestRequestByPatientId)
  .patch(updateTestRequest);

router.route("/test-result").post(createTestResult);

router.route("/test-result/:id").get(getTestResultById).patch(updateTestResult);
module.exports = router;
