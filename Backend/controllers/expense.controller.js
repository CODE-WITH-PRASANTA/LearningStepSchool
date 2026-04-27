const Expense = require("../models/expense.model");

// ➕ CREATE EXPENSE
exports.createExpense = async (req, res) => {
  try {
    const expense = await Expense.create(req.body);
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📋 GET ALL EXPENSES
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✏️ UPDATE EXPENSE
exports.updateExpense = async (req, res) => {
  try {
    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // return updated data
    );

    res.json(updatedExpense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.searchExpenses = async (req, res) => {
  try {
    const { head, payment, from, to, text } = req.query;

    let filter = {};

    if (head) filter.head = head;
    if (payment) filter.paymentMode = payment;

    // Date filter
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }

    // Text search (name / description)
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

// ❌ DELETE EXPENSE
exports.deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};