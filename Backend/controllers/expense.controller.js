const mongoose = require("mongoose");
const Expense = require("../models/expense.model");
const Wallet = require("../models/walletTransaction.model");

/* ================= CREATE EXPENSE ================= */
exports.createExpense = async (req, res) => {
  try {
    const expense = await Expense.create(req.body);

    const walletTx = await Wallet.create({
      type: "debit",
      amount: expense.amount,
      source: "expense",
      referenceId: expense._id,
      description: expense.name,
    });

    // 🔗 Link
    expense.walletLinked = true;
    expense.walletTransactionId = walletTx._id;
    await expense.save();

    res.status(201).json(expense);
  } catch (err) {
    console.log("🔥 EXPENSE ERROR:", err); // 👈 ADD THIS
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET ALL EXPENSES ================= */
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= UPDATE EXPENSE ================= */
exports.updateExpense = async (req, res) => {
  try {
    const expenseId = req.params.id;

    const oldExpense = await Expense.findById(expenseId);
    if (!oldExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
      expenseId,
      req.body,
      { new: true },
    );

    const walletTx = await Wallet.findOne({ referenceId: expenseId });

    if (walletTx) {
      // ✅ Only update if changed
      if (req.body.amount !== undefined) {
        walletTx.amount = updatedExpense.amount;
      }

      if (req.body.name) {
        walletTx.description = updatedExpense.name;
      }

      walletTx.updatedAt = new Date();
      await walletTx.save();
    }

    res.json(updatedExpense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= SEARCH EXPENSE ================= */
exports.searchExpenses = async (req, res) => {
  try {
    const { head, payment, from, to, text } = req.query;

    let filter = {};

    if (head) filter.head = head;
    if (payment) filter.paymentMode = payment;

    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }

    if (text) {
      filter.$or = [
        { name: { $regex: text, $options: "i" } },
        { description: { $regex: text, $options: "i" } },
      ];
    }

    const expenses = await Expense.find(filter).sort({ createdAt: -1 });

    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= DELETE EXPENSE ================= */
exports.deleteExpense = async (req, res) => {
  try {
    const expenseId = req.params.id;

    const expense = await Expense.findById(expenseId);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    await Wallet.deleteOne({ referenceId: expenseId });
    await Expense.findByIdAndDelete(expenseId);

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
