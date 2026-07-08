const express = require("express");
const router = express.Router();

const {
  createPayroll,
  getPayrolls,
  updatePayroll,
  deletePayroll,
  bulkPayPayrolls
} = require("../controllers/payroll.controller");

// Create
router.post("/", createPayroll);

// Get All
router.get("/", getPayrolls);

router.put("/bulk-pay", bulkPayPayrolls);
// Update
router.put("/:id", updatePayroll);

// Delete
router.delete("/:id", deletePayroll);

module.exports = router;