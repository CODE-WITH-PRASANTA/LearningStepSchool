const Class = require("../models/class.model");
const { deleteImageFile } = require("../middleware/upload");

/* CREATE CLASS */

exports.createClass = async (req, res) => {
  try {
    const newClass = new Class({
      ...req.body,
      image: req.body.image || "",
    });

    await newClass.save();

    res.status(201).json({
      success: true,
      message: "Class created",
      data: newClass,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET ALL CLASSES */

exports.getClasses = async (req, res) => {
  try {
    const classes = await Class.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: classes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* UPDATE CLASS */

exports.updateClass = async (req, res) => {
  try {
    const existing = await Class.findById(req.params.id);

    if (!existing) {
      return res.status(404).json({ message: "Class not found" });
    }

    if (req.body.image && existing.image) {
      deleteImageFile(existing.image);
    }

    const updated = await Class.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      message: "Class updated",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* DELETE CLASS */

exports.deleteClass = async (req, res) => {
  try {
    const existing = await Class.findById(req.params.id);

    if (!existing) {
      return res.status(404).json({ message: "Class not found" });
    }

    if (existing.image) {
      deleteImageFile(existing.image);
    }

    await Class.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Class deleted",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};