const FeeType = require("../models/feeType.model");

// GET ALL
exports.getFeeTypes = async (req, res) => {
  try {
    const data = await FeeType.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE
exports.createFeeType = async (req, res) => {
  try {
    const newData = new FeeType(req.body);
    const saved = await newData.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
exports.updateFeeType = async (req, res) => {
  try {
    const updated = await FeeType.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE
exports.deleteFeeType = async (req, res) => {
  try {
    await FeeType.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};