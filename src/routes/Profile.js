const express = require("express");
const { uploadProfilePicture } = require("../controllers/Profile");
const { Protect } = require("../middleware/protect");
const upload = require("../config/multerConfig");

const router = express.Router();

router
  .route("/upload")
  .post(Protect, upload.single("profile_pic"), uploadProfilePicture);

module.exports = router;
