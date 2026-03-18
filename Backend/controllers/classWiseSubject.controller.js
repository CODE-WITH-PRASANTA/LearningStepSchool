const ClassWiseSubject = require("../models/ClassWiseSubject.model");


// ✅ ADD / UPDATE SUBJECTS
exports.addSubjects = async (req, res) => {
  try {
    const { classId, subjects } = req.body;

    if (!classId || !subjects || subjects.length === 0) {
      return res.status(400).json({
        success: false,
        message: "classId and subjects are required",
      });
    }

    let existing = await ClassWiseSubject.findOne({ classId });

    if (existing) {
      // merge + remove duplicates
      existing.subjects = [
        ...new Set([...existing.subjects, ...subjects]),
      ];

      await existing.save();

      return res.json({
        success: true,
        message: "Subjects updated",
        data: existing,
      });
    }

    const data = await ClassWiseSubject.create({
      classId,
      subjects,
    });

    res.json({
      success: true,
      message: "Subjects added",
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// ✅ GET ALL
exports.getAll = async (req, res) => {
  try {
    const data = await ClassWiseSubject.find()
      .populate("classId", "className");

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// ✅ GET BY CLASS
exports.getByClass = async (req, res) => {
  try {
    const data = await ClassWiseSubject.findOne({
      classId: req.params.classId,
    }).populate("classId", "className");

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// ✅ REMOVE ONE SUBJECT
exports.removeSubject = async (req, res) => {
  try {
    const { classId, subject } = req.body;

    const updated = await ClassWiseSubject.findOneAndUpdate(
      { classId },
      { $pull: { subjects: subject } },
      { new: true }
    );

    res.json({
      success: true,
      message: "Subject removed",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// ✅ DELETE FULL CLASS ENTRY
exports.deleteClassSubjects = async (req, res) => {
  try {
    await ClassWiseSubject.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Class deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};