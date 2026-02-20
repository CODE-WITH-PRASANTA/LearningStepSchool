const Fee = require("../models/fee.model");

/* CREATE */
exports.createFee = async (req, res) => {
  try {
    const { title, price, features } = req.body;

    const fee = await Fee.create({
      title,
      price,
      features,
    });

    res.status(201).json(fee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET ALL */
exports.getFees = async (req, res) => {
  try {
    const fees = await Fee.find().sort({ createdAt: -1 });
    res.json(fees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* UPDATE */
exports.updateFee = async (req, res) => {
  try {
    const updated = await Fee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* DELETE */
exports.deleteFee = async (req, res) => {
  try {
    await Fee.findByIdAndDelete(req.params.id);
    res.json({ message: "Fee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};