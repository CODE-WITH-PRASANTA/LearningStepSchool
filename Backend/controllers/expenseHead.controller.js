const ExpenseHead = require("../models/expenseHead.model");

// ➕ CREATE
exports.createExpenseHead = async (req, res) => {
  try {
    const head = await ExpenseHead.create(req.body);
    res.status(201).json(head);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📋 GET ALL
exports.getExpenseHeads = async (req, res) => {
  try {
    const heads = await ExpenseHead.find().sort({ createdAt: -1 });
    res.json(heads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✏️ UPDATE
exports.updateExpenseHead = async (req, res) => {
  try {
    const updated = await ExpenseHead.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ❌ DELETE
exports.deleteExpenseHead = async (req, res) => {
  try {
    await ExpenseHead.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};