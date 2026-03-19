const ExamType = require("../models/ExamType.model");

// ✅ CREATE
exports.createExamType = async (req, res) => {
  try {
    const { name } = req.body;

    const data = await ExamType.create({ name });

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ GET ALL
exports.getExamTypes = async (req, res) => {
  try {
    const data = await ExamType.find();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

// ✅ TOGGLE PUBLISH
exports.togglePublish = async (req, res) => {
  try {
    const exam = await ExamType.findById(req.params.id);

    exam.isPublished = !exam.isPublished;

    await exam.save();

    res.json({ success: true, data: exam });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

// ✅ DELETE
exports.deleteExamType = async (req, res) => {
  try {
    await ExamType.findByIdAndDelete(req.params.id);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};