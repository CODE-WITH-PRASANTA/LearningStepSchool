const express = require("express");

const router = express.Router();

const {
  closeAcademicSession,
  getCarryForward,
} = require("../../controllers/Fee/feeBalance.controller");

// Close previous academic session
router.post(
  "/close-session",
  closeAcademicSession
);

// Get carry-forward for new academic session
router.get(
  "/carry-forward/:studentId/:academicYear",
  getCarryForward
);

module.exports = router;