const express = require("express");
const router = express.Router();

const { createFeeEntry, getStudentFeeEntries } = require("../../controllers/Fee/feeEntry.controller");

router.post("/create", createFeeEntry);
router.get("/student/:studentId", getStudentFeeEntries);

module.exports = router;
