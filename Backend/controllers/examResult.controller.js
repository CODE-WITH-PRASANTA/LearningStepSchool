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

// 🎯 FILTER REGULAR SUBJECTS
const getRegularSubjects = (subjects) => {
  return (subjects || []).filter(
    (s) => (s.type || "regular") === "regular"
  );
};

// 🎯 RESULT (FAIL CHECK ONLY ON REGULAR)
const getResult = (subjects) => {
  const regular = getRegularSubjects(subjects);

  const failed = regular.some(
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
      class: className,
      examType,
      subjects,
    } = req.body;

    if (!subjects || subjects.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Subjects required",
      });
    }

    const regularSubjects = getRegularSubjects(subjects);

    const totalMarks = regularSubjects.reduce(
      (sum, s) => sum + Number(s.marks || 0),
      0
    );

    const totalFullMarks = regularSubjects.reduce(
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
      class: className,
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

// ================= REPORT =================
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

    const exams = [...new Set(results.map((r) => r.examType))];

    const subjectMap = {};

    // ✅ INCLUDE ALL SUBJECTS (regular + optional)
    results.forEach((exam) => {
      exam.subjects.forEach((sub) => {
        const subjectName = sub.name || sub.subject || "Unknown";
        const type = sub.type || "regular";

        if (!subjectMap[subjectName]) {
          subjectMap[subjectName] = {
            name: subjectName,
            exams: {},
            fullMarks: {},
            type: type, // ✅ store type
          };
        }

        subjectMap[subjectName].exams[exam.examType] =
          Number(sub.marks) || 0;

        subjectMap[subjectName].fullMarks[exam.examType] =
          Number(sub.fullMarks) || 0;
      });
    });

    const subjects = Object.values(subjectMap);

    const totals = {};
    let grandTotal = 0;

    // ✅ TOTAL ONLY FROM REGULAR SUBJECTS
    exams.forEach((examName) => {
      let sum = 0;

      subjects.forEach((s) => {
        if ((s.type || "regular") === "regular") {
          sum += s.exams[examName] || 0;
        }
      });

      totals[examName] = sum;
      grandTotal += sum;
    });

    // ✅ FULL MARKS ONLY REGULAR
    const fullMarks = results.reduce((total, exam) => {
      return (
        total +
        exam.subjects
          .filter((s) => (s.type || "regular") === "regular")
          .reduce((sum, s) => sum + Number(s.fullMarks || 0), 0)
      );
    }, 0);

    const percentage = fullMarks ? (grandTotal / fullMarks) * 100 : 0;

    const studentData = await Student.findOne({
      admissionNo: results[0].admissionNo,
    });

    const student = {
      admissionNo: results[0].admissionNo || "",
      name: `${studentData?.firstName || ""} ${studentData?.lastName || ""}`.trim(),
      rollNumber: results[0].rollNumber,
      class: results[0].class,
      fatherName: studentData?.fatherName || "",
      motherName: studentData?.motherName || "",
      dob: studentData?.dob || "",
      aadhar: studentData?.aadharNumber || "",
      bloodGroup: studentData?.bloodGroup || "",
      house: studentData?.house || "",
      penNo: studentData?.pen || "",
      weight: studentData?.weight || "",
      studentPhoto: studentData?.studentPhoto || "",
    };

    res.json({
      success: true,
      student,
      exams,
      subjects,      // ✅ now includes optional
      totals,        // ✅ only regular counted
      grandTotal,    // ✅ only regular counted
      fullMarks,     // ✅ only regular counted
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
    const { subjects, class: className } = req.body;

    if (!subjects || subjects.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Subjects required",
      });
    }

    const regularSubjects = getRegularSubjects(subjects);

    const totalMarks = regularSubjects.reduce(
      (sum, s) => sum + Number(s.marks || 0),
      0
    );

    const totalFullMarks = regularSubjects.reduce(
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
        class: className,
        total: totalMarks,
        fullMarks: totalFullMarks,
        percentage,
        grade,
        result,
      },
      { new: true }
    );

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= SEARCH RESULT =================
exports.searchResult = async (req, res) => {
  try {
    const { name, roll, exam, className, dob } = req.query;

    // ✅ Basic validation
    if (!name || !exam) {
      return res.status(400).json({
        success: false,
        message: "Name & Exam are required",
      });
    }

    // ✅ Must provide roll OR class + dob
    if (!roll && !(className && dob)) {
      return res.status(400).json({
        success: false,
        message: "Provide Roll OR Class + DOB",
      });
    }

    // 🔐 Escape regex (security)
    const escapeRegex = (text) =>
      text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // 🔍 Partial name match (first 3 letters)
    const shortName = name.trim().substring(0, 3);

    const nameRegex = new RegExp("^" + escapeRegex(shortName), "i");
    const examRegex = new RegExp("^" + escapeRegex(exam.trim()), "i");

    let result = null;
    let student = null;

    // ================= WITH ROLL =================
    if (roll && roll.trim() !== "") {
      result = await ExamResult.findOne({
        name: { $regex: nameRegex },
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
        name: { $regex: nameRegex },
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

      // 🔐 DOB verification
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


// ================= FIX OLD DATA =================
exports.fixResultsData = async (req, res) => {
  try {
    const results = await ExamResult.find();

    for (let r of results) {
      const regular = (r.subjects || [])
        .map((s) => ({
          ...s._doc,
          type: s.type || "regular",
        }))
        .filter((s) => s.type === "regular");

      const total = regular.reduce(
        (sum, s) => sum + Number(s.marks || 0),
        0
      );

      const fullMarks = regular.reduce(
        (sum, s) => sum + Number(s.fullMarks || 0),
        0
      );

      const percentage = fullMarks
        ? (total / fullMarks) * 100
        : 0;

      let grade = "F";
      if (percentage >= 90) grade = "A+";
      else if (percentage >= 75) grade = "A";
      else if (percentage >= 60) grade = "B";
      else if (percentage >= 40) grade = "C";

      const result = regular.some(
        (s) => Number(s.marks) < Number(s.fullMarks) * 0.35
      )
        ? "Fail"
        : "Pass";

      r.total = total;
      r.fullMarks = fullMarks;
      r.percentage = percentage;
      r.grade = grade;
      r.result = result;

      await r.save();
    }

    res.json({ message: "All results fixed successfully ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fix failed" });
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
