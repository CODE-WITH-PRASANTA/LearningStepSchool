const express = require("express");

const router = express.Router();

const {
  createFeeEntry,
  getStudentFeeEntries,
  getAdvanceWallet,
  getCarryForward,
  createPreviousPayment,
} = require("../../controllers/Fee/feeEntry.controller");

router.post("/create", createFeeEntry);

router.post(
  "/previous-payment",
  createPreviousPayment
);

router.get("/student/:studentId", getStudentFeeEntries);

router.get("/advance/:studentId", getAdvanceWallet);

// Carry Forward
router.get(
  "/carry-forward/:studentId/:academicYear",
  getCarryForward
);

module.exports = router;