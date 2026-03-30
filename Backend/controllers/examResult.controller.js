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
    (s) => Number(s.marks) < Number(s.fullMarks) * 0.35,
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
      subjects,
    } = req.body;

    if (!subjects || subjects.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Subjects required",
      });
    }

    const totalMarks = subjects.reduce(
      (sum, s) => sum + Number(s.marks || 0),
      0,
    );

    const totalFullMarks = subjects.reduce(
      (sum, s) => sum + Number(s.fullMarks || 0),
      0,
    );

    const percentage = totalFullMarks ? (totalMarks / totalFullMarks) * 100 : 0;

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
      result,
    });

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
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
      message: err.message,
    });
  }
};

// ================= UPDATE =================
exports.updateResult = async (req, res) => {
  try {
    const {
      subjects,
      class: className, // ✅ NEW
    } = req.body;

    if (!subjects || subjects.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Subjects required",
      });
    }

    const totalMarks = subjects.reduce(
      (sum, s) => sum + Number(s.marks || 0),
      0,
    );

    const totalFullMarks = subjects.reduce(
      (sum, s) => sum + Number(s.fullMarks || 0),
      0,
    );

    const percentage = totalFullMarks ? (totalMarks / totalFullMarks) * 100 : 0;

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
        result,
      },
      { new: true },
    );

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= DELETE =================
exports.deleteResult = async (req, res) => {
  try {
    await ExamResult.findByIdAndDelete(req.params.id);

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



exports.searchResult = async (req, res) => {
  try {
    const { name, roll, exam, className, dob } = req.query;

    // ✅ Basic validation
    if (!name || !exam) {
      return res.status(400).json({
        success: false,
        message: "Name & Exam required",
      });
    }

    // ✅ Require either roll OR class+dob
    if (!roll && !(className && className.trim() !== "" && dob)) {
      return res.status(400).json({
        success: false,
        message: "Provide Roll OR Class + DOB",
      });
    }

    // 🔐 Escape regex (security)
    const escapeRegex = (text) =>
      text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const safeName = escapeRegex(name.trim());
    const safeExam = escapeRegex(exam.trim());

    let result = null;
    let student = null;

    // ================= WITH ROLL =================
    if (roll && roll.trim() !== "") {
      result = await ExamResult.findOne({
        name: { $regex: new RegExp("^" + safeName + "$", "i") },
        rollNumber: roll.trim(),
        examType: { $regex: new RegExp("^" + safeExam + "$", "i") },
      });
    }

    // ================= WITHOUT ROLL =================
    else {
      result = await ExamResult.findOne({
        name: { $regex: new RegExp("^" + safeName + "$", "i") },
        class: { $regex: className.trim(), $options: "i" },
        examType: { $regex: new RegExp("^" + safeExam + "$", "i") },
      });

      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Result not found",
        });
      }

      // ✅ Fetch student
      student = await Student.findOne({
        admissionNo: result.admissionNo,
      });

      // ✅ DOB validation (safe + no crash)
      if (
        !student ||
        !student.dob ||
        new Date(student.dob).toISOString().split("T")[0] !== dob
      ) {
        return res.status(404).json({
          success: false,
          message: "DOB does not match",
        });
      }
    }

    // ================= NOT FOUND =================
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Result not found",
      });
    }

    // ================= FETCH STUDENT (ROLL CASE) =================
    if (!student) {
      try {
        student = await Student.findOne({
          admissionNo: result.admissionNo,
        });
      } catch (err) {
        console.log("Student fetch error:", err.message);
      }
    }

    // ================= FINAL RESPONSE =================
    const finalData = {
      ...result.toObject(),
      fatherName: student?.fatherName || "",
      motherName: student?.motherName || "",
      dob: student?.dob || "",
      studentPhoto: student?.studentPhoto || "",
    };

    return res.json({
      success: true,
      data: finalData,
    });

  } catch (err) {
    console.error("SEARCH ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};