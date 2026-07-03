const express = require("express");
const router = express.Router();

const { createFeeEntry, getStudentFeeEntries,getAdvanceWallet } = require("../../controllers/Fee/feeEntry.controller");

router.post("/create", createFeeEntry);
router.get("/student/:studentId", getStudentFeeEntries);
router.get(
  "/advance/:studentId",
  getAdvanceWallet
);
module.exports = router;
