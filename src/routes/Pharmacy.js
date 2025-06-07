const express = require("express");
const {
  getAvailableMedicines,
  orderMedicine,
} = require("../controllers/Pharmacy");

const router = express.Router();

router.route("/orders").post(orderMedicine);
router.route("/medicines").get(getAvailableMedicines);

module.exports = router;
