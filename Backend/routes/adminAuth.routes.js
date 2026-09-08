const express = require("express");

const {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  getAdminProfile,
  updateAdminProfile,
  updatePassword,
} = require("../controllers/adminAuth.controller");

const protect = require("../middleware/authMiddleware");

const {
  upload,
  convertToWebp,
} = require("../middleware/upload");

const router = express.Router();

/* =====================================================
   AUTH
===================================================== */

router.post("/register", registerAdmin);

router.post("/login", loginAdmin);

router.post(
  "/logout",
  protect,
  logoutAdmin
);

/* =====================================================
   PROFILE
===================================================== */

// Get profile
router.get(
  "/profile",
  protect,
  getAdminProfile
);

// Update profile + avatar
router.put(
  "/profile",
  protect,
  upload.single("avatar"),
  convertToWebp,
  updateAdminProfile
);

/* =====================================================
   PASSWORD
===================================================== */

router.put(
  "/update-password",
  protect,
  updatePassword
);

/* =====================================================
   TEST
===================================================== */

router.get(
  "/test",
  protect,
  (req, res) => {
    res.status(200).json({
      message: "Authorized access",
      user: req.user,
    });
  }
);

module.exports = router;