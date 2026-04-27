const express = require("express");
const {
  createExpense,
  getExpenses,
  deleteExpense,
  updateExpense,
  searchExpenses,
} = require("../controllers/expense.controller");

const router = express.Router();

router.post("/", createExpense);
router.get("/", getExpenses);
router.get("/search", searchExpenses);
router.put("/:id", updateExpense); // ✅ UPDATE
router.delete("/:id", deleteExpense);

module.exports = router; 