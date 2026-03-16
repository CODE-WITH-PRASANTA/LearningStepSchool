const Class = require("../models/class.model");

/* ================= CREATE CLASS ================= */

exports.createClass = async (req, res) => {
  try {

    const { className, sectionName } = req.body;

    const newClass = new Class({
      className,
      sectionName
    });

    await newClass.save();

    res.status(201).json({
      success: true,
      message: "Class created successfully",
      data: newClass
    });

  } catch (error) {

    if (error.code === 11000) {
      return res.status(400).json({
        message: "Class with this section already exists"
      });
    }

    res.status(500).json({
      message: error.message
    });
  }
};


/* ================= GET ALL CLASSES ================= */

exports.getClasses = async (req, res) => {
  try {

    const classes = await Class.find()
      .sort({ className: 1, sectionName: 1 });

    res.json({
      success: true,
      data: classes
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


/* ================= UPDATE CLASS ================= */

exports.updateClass = async (req, res) => {
  try {

    const updated = await Class.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        message: "Class not found"
      });
    }

    res.json({
      success: true,
      message: "Class updated successfully",
      data: updated
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


/* ================= DELETE CLASS ================= */

exports.deleteClass = async (req, res) => {
  try {

    const deleted = await Class.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        message: "Class not found"
      });
    }

    res.json({
      success: true,
      message: "Class deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};