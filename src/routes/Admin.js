const express = require("express");
const {
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  getAllUsers,
  deleteUserById,
} = require("../controllers/Admin");

const { Register } = require("../controllers/Auth");
const { authorize } = require("../middleware/adminAuth");
const { Protect } = require("../middleware/protect");

const router = express.Router();

router.route("/").get(Protect, authorize(["manage_users"]), getAllAdmins);

router
  .route("/register/user")
  .post(Protect, authorize(["manage_users"]), Register);

router.route("/users").get(Protect, authorize(["manage_users"]), getAllUsers);

router
  .route("/delete")
  .delete(Protect, authorize(["manage_users"]), deleteUserById);

router.route("/:id").get(getAdminById).patch(updateAdmin).delete(deleteAdmin);

module.exports = router;
