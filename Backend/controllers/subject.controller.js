const Subject = require("../models/subject.model");
const { deleteImageFile } = require("../middleware/upload");

/* ================= CREATE SUBJECT ================= */

exports.createSubject = async (req, res) => {
  try {

    const subject = new Subject({
      ...req.body,
      image: req.body.image || ""
    });

    await subject.save();

    res.status(201).json({
      success: true,
      message: "Subject created",
      data: subject
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================= GET SUBJECTS ================= */

exports.getSubjects = async (req, res) => {
  try {

    const subjects = await Subject.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: subjects
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================= UPDATE SUBJECT ================= */

exports.updateSubject = async (req, res) => {
  try {

    const existing = await Subject.findById(req.params.id);

    if (!existing) {
      return res.status(404).json({ message: "Subject not found" });
    }

    if (req.body.image && existing.image) {
      deleteImageFile(existing.image);
    }

    const updated = await Subject.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      message: "Subject updated",
      data: updated
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================= DELETE SUBJECT ================= */

exports.deleteSubject = async (req, res) => {
  try {

    const existing = await Subject.findById(req.params.id);

    if (!existing) {
      return res.status(404).json({ message: "Subject not found" });
    }

    if (existing.image) {
      deleteImageFile(existing.image);
    }

    await Subject.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Subject deleted"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};