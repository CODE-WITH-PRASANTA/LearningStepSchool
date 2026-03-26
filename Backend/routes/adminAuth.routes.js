const express = require("express");
const {
  registerAdmin,
  loginAdmin,
  logoutAdmin
} = require("../controllers/adminAuth.controller");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// ================= AUTH =================

// Register (PUBLIC)
router.post("/register", registerAdmin);

// Login (PUBLIC)
router.post("/login", loginAdmin);

// Logout (PROTECTED)
router.post("/logout", protect, logoutAdmin);

// Protected test route (check login working or not)
router.get("/profile", protect, (req, res) => {
  res.status(200).json({
    message: "Authorized access ✅",
    user: req.user,
  });
});

module.exports = router;