const ExamType = require("../models/ExamType.model");

// ================= CREATE =================
exports.createExamType = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Exam name is required",
      });
    }

    // ✅ Prevent duplicate
    const exists = await ExamType.findOne({
      name: { $regex: new RegExp("^" + name + "$", "i") },
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Exam type already exists",
      });
    }

    const data = await ExamType.create({
      name: name.trim(),
    });

    res.json({ success: true, data });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= GET ALL =================
// 👉 For admin (all exam types)
exports.getExamTypes = async (req, res) => {
  try {
    const data = await ExamType.find().sort({ createdAt: -1 });

    res.json({ success: true, data });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= GET PUBLISHED =================
// 👉 For student dropdown (IMPORTANT)
exports.getPublishedExamTypes = async (req, res) => {
  try {
    const data = await ExamType.find({ isPublished: true })
      .sort({ createdAt: -1 });

    res.json({ success: true, data });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= TOGGLE PUBLISH =================
exports.togglePublish = async (req, res) => {
  try {
    const exam = await ExamType.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam type not found",
      });
    }

    exam.isPublished = !exam.isPublished;

    await exam.save();

    res.json({
      success: true,
      message: "Status updated",
      data: exam,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= DELETE =================
exports.deleteExamType = async (req, res) => {
  try {
    const exam = await ExamType.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam type not found",
      });
    }

    await exam.deleteOne();

    res.json({
      success: true,
      message: "Deleted successfully",
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};