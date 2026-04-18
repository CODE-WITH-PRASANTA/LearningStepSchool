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
exports.getStudentAllResults = async (req, res) => {
  try {
    const { admissionNo } = req.params;

    const results = await ExamResult.find({ admissionNo });

    if (!results.length) {
      return res.status(404).json({
        success: false,
        message: "No results found",
      });
    }

    // ✅ SORT EXAMS (IMPORTANT)
    const exams = [...new Set(results.map((r) => r.examType))];

    // 🔥 SUBJECT MAP FIX (MAIN FIX)
    const subjectMap = {};

    results.forEach((exam) => {
      exam.subjects.forEach((sub) => {
        // ✅ HANDLE BOTH CASES
        const subjectName = sub.name || sub.subject || "Unknown";

        if (!subjectMap[subjectName]) {
          subjectMap[subjectName] = {
            name: subjectName,
            exams: {},
          };
        }

        subjectMap[subjectName].exams[exam.examType] = Number(sub.marks) || 0;
      });
    });

    // ✅ CONVERT TO ARRAY
    const subjects = Object.values(subjectMap);

    // 🔥 TOTALS
    const totals = {};
    let grandTotal = 0;

    exams.forEach((examName) => {
      let sum = 0;

      subjects.forEach((s) => {
        sum += s.exams[examName] || 0;
      });

      totals[examName] = sum;
      grandTotal += sum;
    });

    // 🔥 FULL MARKS (SAFE FIX)
    const fullMarks = results.reduce((total, exam) => {
      return (
        total +
        exam.subjects.reduce((sum, s) => sum + Number(s.fullMarks || 0), 0)
      );
    }, 0);

    const percentage = fullMarks ? (grandTotal / fullMarks) * 100 : 0;

    const student = {
      name: results[0].name,
      rollNumber: results[0].rollNumber,
      class: results[0].class,
    };

    res.json({
      success: true,
      student,
      exams,
      subjects,
      totals,
      grandTotal,
      fullMarks,
      percentage,
      grade: percentage >= 60 ? "Pass" : "Fail",
    });
  } catch (err) {
    console.error("REPORT ERROR:", err);
    res.status(500).json({ message: err.message });
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

// 🎯 RESULT
const getResult = (subjects) => {
  const failed = subjects.some(
    (s) => Number(s.marks) < Number(s.fullMarks) * 0.35,
  );
  return failed ? "Fail" : "Pass";
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

    // ✅ Require strong validation
    if (!roll && !(className && dob)) {
      return res.status(400).json({
        success: false,
        message: "Provide Roll OR Class + DOB",
      });
    }

    // 🔐 Escape regex
    const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // ✅ Take ONLY first 3 letters
    const shortName = name.trim().substring(0, 3);

    // ✅ Match FIRST NAME only
    const nameRegex = new RegExp("^" + escapeRegex(shortName), "i");

    const examRegex = new RegExp("^" + escapeRegex(exam.trim()), "i");

    let result = null;
    let student = null;

    // ================= WITH ROLL =================
    if (roll && roll.trim() !== "") {
      result = await ExamResult.findOne({
        name: { $regex: nameRegex }, // 🔥 partial match
        rollNumber: roll.trim(),
        examType: { $regex: examRegex },
      });

      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Result not found",
        });
      }

      student = await Student.findOne({
        admissionNo: result.admissionNo,
      });
    }

    // ================= WITHOUT ROLL =================
    else {
      result = await ExamResult.findOne({
        name: { $regex: nameRegex }, // 🔥 partial match
        class: { $regex: className.trim(), $options: "i" },
        examType: { $regex: examRegex },
      });

      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Result not found",
        });
      }

      student = await Student.findOne({
        admissionNo: result.admissionNo,
      });

      // 🔥 MAIN SECURITY CHECK (MOST IMPORTANT)
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

    // ✅ FINAL RESPONSE
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
