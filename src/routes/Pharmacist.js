const express = require("express");
const {
  getAllPharmacist,
  getPharmacistById,
  updatePharmacist,
  deletePharmacist,
} = require("../controllers/Phamarcist");

const router = express.Router();

router.route("/").get(getAllPharmacist);

router
  .route("/:id")
  .get(getPharmacistById)
  .patch(updatePharmacist)
  .delete(deletePharmacist);

module.exports = router;
