const DamageBook = require("../models/Library/DamageBook");
const Book = require("../models/Library/Book");

exports.createDamageBook = async (req, res) => {
  try {
    const { book, damageDate, damagedQty, remark } = req.body;

    if (!book || !damageDate || !damagedQty) {
      return res.status(400).json({ message: "Book, date and quantity required" });
    }

    const damage = await DamageBook.create({
      book,
      damageDate,
      damagedQty,
      remark,
    });

    res.status(201).json({
      success: true,
      message: "Damage book added successfully",
      data: damage,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getDamageBooks = async (req, res) => {
  try {
    const data = await DamageBook.find()
      .populate("book")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateDamageBook = async (req, res) => {
  try {
    const damage = await DamageBook.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!damage) {
      return res.status(404).json({ success: false, message: "Damage record not found" });
    }

    res.status(200).json({
      success: true,
      message: "Damage book updated successfully",
      data: damage,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteDamageBook = async (req, res) => {
  try {
    const damage = await DamageBook.findByIdAndDelete(req.params.id);

    if (!damage) {
      return res.status(404).json({ success: false, message: "Damage record not found" });
    }

    res.status(200).json({
      success: true,
      message: "Damage book deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};