const ExamResult = require("../models/ExamResult.model");
const Student = require("../models/sudentAdmission.model");

// 🎯 GRADE
const getGrade = (percentage) => {
  if (percentage >= 90) return "A+";
  if (percentage >= 75) return "A";
  if (percentage >= 60) return "B";
  if (percentage >= 40) return "C";
  return "F";
};

// 🎯 RESULT
const getResult = (subjects) => {
  const failed = subjects.some(
    (s) => Number(s.marks) < Number(s.fullMarks) * 0.35
  );
  return failed ? "Fail" : "Pass";
};

// ================= CREATE =================
exports.createResult = async (req, res) => {
  try {
    const {
      admissionNo,
      name,
      rollNumber,
      classId,
      class: className, // ✅ NEW
      examType,
      subjects
    } = req.body;

    if (!subjects || subjects.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Subjects required"
      });
    }

    const totalMarks = subjects.reduce(
      (sum, s) => sum + Number(s.marks || 0),
      0
    );

    const totalFullMarks = subjects.reduce(
      (sum, s) => sum + Number(s.fullMarks || 0),
      0
    );

    const percentage = totalFullMarks
      ? (totalMarks / totalFullMarks) * 100
      : 0;

    const grade = getGrade(percentage);
    const result = getResult(subjects);

    const data = await ExamResult.create({
      admissionNo,
      name,
      rollNumber,
      classId: classId || null,
      class: className, // ✅ SAVE CLASS
      examType,
      subjects,
      total: totalMarks,
      fullMarks: totalFullMarks,
      percentage,
      grade,
      result
    });

    res.json({ success: true, data });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// ================= GET =================
exports.getResults = async (req, res) => {
  try {
    const data = await ExamResult.find()
      .populate("classId", "className")
      .sort({ createdAt: -1 });

    res.json({ success: true, data });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// ================= UPDATE =================
exports.updateResult = async (req, res) => {
  try {
    const {
      subjects,
      class: className // ✅ NEW
    } = req.body;

    if (!subjects || subjects.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Subjects required"
      });
    }

    const totalMarks = subjects.reduce(
      (sum, s) => sum + Number(s.marks || 0),
      0
    );

    const totalFullMarks = subjects.reduce(
      (sum, s) => sum + Number(s.fullMarks || 0),
      0
    );

    const percentage = totalFullMarks
      ? (totalMarks / totalFullMarks) * 100
      : 0;

    const grade = getGrade(percentage);
    const result = getResult(subjects);

    const data = await ExamResult.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        class: className, // ✅ UPDATE CLASS
        total: totalMarks,
        fullMarks: totalFullMarks,
        percentage,
        grade,
        result
      },
      { new: true }
    );

    res.json({ success: true, data });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// ================= DELETE =================
exports.deleteResult = async (req, res) => {
  try {
    await ExamResult.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Deleted successfully"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};



exports.searchResult = async (req, res) => {
  try {
    const { name, roll, exam } = req.query;

    if (!name || !roll || !exam) {
      return res.status(400).json({
        success: false,
        message: "Name, Roll & Exam required"
      });
    }

    const cleanName = name.trim();
    const cleanExam = exam.trim();

    // ✅ FIND RESULT
    const result = await ExamResult.findOne({
      name: { $regex: new RegExp("^" + cleanName + "$", "i") },
      rollNumber: roll.trim(),
      examType: { $regex: new RegExp("^" + cleanExam + "$", "i") }
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Result not found"
      });
    }

    let student = null;

    try {
      // ✅ SAFE STUDENT FETCH
      student = await Student.findOne({
        admissionNo: result.admissionNo
      });
    } catch (err) {
      console.log("Student fetch error:", err.message);
    }

    // ✅ SAFE MERGE (NO CRASH)
    const finalData = {
      ...result.toObject(),
      fatherName: student?.fatherName || "",
      motherName: student?.motherName || "",
      dob: student?.dob || "",
      studentPhoto: student?.studentPhoto || ""
    };

    res.json({
      success: true,
      data: finalData
    });

  } catch (err) {
    console.error("SEARCH ERROR:", err); // 🔥 IMPORTANT

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};