const express = require("express");

const router = express.Router();

const {
  upload,
  convertToWebp,
} = require("../middleware/upload");

const {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  approveExpense,
} = require("../controllers/expenseMng.controller");


/* =====================================================
   CREATE EXPENSE
===================================================== */

router.post(
  "/",
  upload.single("bill"),
  convertToWebp,
  createExpense
);


/* =====================================================
   GET ALL EXPENSES
===================================================== */

router.get(
  "/",
  getExpenses
);


/* =====================================================
   GET SINGLE EXPENSE
===================================================== */

router.get(
  "/:id",
  getExpenseById
);


/* =====================================================
   UPDATE EXPENSE
===================================================== */

router.put(
  "/:id",
  upload.single("bill"),
  convertToWebp,
  updateExpense
);


/* =====================================================
   APPROVE / UNAPPROVE EXPENSE
===================================================== */

router.put(
  "/:id/approve",
  approveExpense
);


/* =====================================================
   DELETE EXPENSE
===================================================== */

router.delete(
  "/:id",
  deleteExpense
);


module.exports = router;