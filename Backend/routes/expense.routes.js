const express = require("express");

const {
  createExpense,
  getExpenses,
  deleteExpense,
  updateExpense,
  searchExpenses,
} = require("../controllers/expense.controller");

const {
  upload,
  convertToWebp,
} = require("../middleware/upload");

const router = express.Router();

/* =========================================================
   CREATE EXPENSE
   POST /api/expenses

   FormData:
   - head
   - accountType
   - accountName
   - name
   - amount
   - invoice
   - date
   - paymentMode
   - description
   - bill       <-- FILE
========================================================= */

router.post(
  "/",
  upload.single("bill"),
  convertToWebp,
  createExpense
);

/* =========================================================
   GET ALL EXPENSES

   GET /api/expenses
========================================================= */

router.get(
  "/",
  getExpenses
);

/* =========================================================
   SEARCH EXPENSES

   GET /api/expenses/search
========================================================= */

router.get(
  "/search",
  searchExpenses
);

/* =========================================================
   UPDATE EXPENSE

   PUT /api/expenses/:id

   bill is optional.

   If a new bill is uploaded:
   - new bill is saved
   - old bill is deleted
   - MongoDB gets new bill path

   If no bill is uploaded:
   - existing bill remains unchanged
========================================================= */

router.put(
  "/:id",
  upload.single("bill"),
  convertToWebp,
  updateExpense
);

/* =========================================================
   DELETE EXPENSE

   DELETE /api/expenses/:id

   Also deletes:
   - Wallet transaction
   - Uploaded bill
   - Expense document
========================================================= */

router.delete(
  "/:id",
  deleteExpense
);

module.exports = router;