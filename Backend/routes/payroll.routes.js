const express = require("express");
const router = express.Router();

const {
  createPayroll,
  getPayrolls,
  updatePayroll,
  deletePayroll,
  bulkPayPayrolls,
    refreshAttendancePayroll,
} = require("../controllers/payroll.controller");

// Create
router.post("/", createPayroll);

// Get All
router.get("/", getPayrolls);

router.put("/bulk-pay", bulkPayPayrolls);

router.put("/refresh-attendance", refreshAttendancePayroll);
// Update
router.put("/:id", updatePayroll);

// Delete
router.delete("/:id", deletePayroll);

module.exports = router;
