const Student = require("../models/sudentAdmission.model");
const { deleteImageFile } = require("../middleware/upload");

/* ================= HELPER ================= */

const getFilePath = (file) => {
  if (!file) return null;
  if (Array.isArray(file)) return file[0].path;
  return file.path || file;
};

/* ================= PARSE ARRAY ================= */

const parseStudentBehaviour = (body) => {
  if (!body.studentBehaviour) return;

  if (typeof body.studentBehaviour === "string") {
    try {
      body.studentBehaviour = JSON.parse(body.studentBehaviour);
    } catch {
      body.studentBehaviour = [];
    }
  }
};

/* ================= CREATE STUDENT ================= */

exports.createStudent = async (req, res) => {
  try {
    parseStudentBehaviour(req.body);

    const student = new Student({
      ...req.body,

      // ✅ FIXED FILES
      studentPhoto: getFilePath(req.files?.studentPhoto),
      fatherPhoto: getFilePath(req.files?.fatherPhoto),
      motherPhoto: getFilePath(req.files?.motherPhoto),
      guardianPhoto: getFilePath(req.files?.guardianPhoto),

      documents: {
        reportCard: getFilePath(req.files?.reportCard),
        tc: getFilePath(req.files?.tc),
        samagraId: getFilePath(req.files?.samagraId),
        nidaCard: getFilePath(req.files?.nidaCard),
        previousMarksheet: getFilePath(req.files?.previousMarksheet),
        dobCertificate: getFilePath(req.files?.dobCertificate),
        aadhaarStudent: getFilePath(req.files?.aadhaarStudent),
        aadhaarParent: getFilePath(req.files?.aadhaarParent),
        incomeCertificate: getFilePath(req.files?.incomeCertificate),
        pip: getFilePath(req.files?.pip),
      },
    });

    await student.save();

    res.status(201).json({
      success: true,
      message: "Student Admission Successful",
      data: student,
    });

  } catch (error) {
    console.error("CREATE STUDENT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET ALL STUDENTS ================= */

exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: students.length,
      data: students,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET STUDENT BY ID ================= */

exports.getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    let student;

    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      student = await Student.findById(id);
    } else {
      student = await Student.findOne({ admissionNo: id });
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.json({
      success: true,
      data: student,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= UPDATE STUDENT ================= */

exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    parseStudentBehaviour(req.body);

    const updateData = { ...req.body };

    /* ================= PHOTO ================= */

    if (req.files?.studentPhoto) {
      deleteImageFile(student.studentPhoto);
      updateData.studentPhoto = getFilePath(req.files.studentPhoto);
    }

    if (req.files?.fatherPhoto) {
      deleteImageFile(student.fatherPhoto);
      updateData.fatherPhoto = getFilePath(req.files.fatherPhoto);
    }

    if (req.files?.motherPhoto) {
      deleteImageFile(student.motherPhoto);
      updateData.motherPhoto = getFilePath(req.files.motherPhoto);
    }

    if (req.files?.guardianPhoto) {
      deleteImageFile(student.guardianPhoto);
      updateData.guardianPhoto = getFilePath(req.files.guardianPhoto);
    }

    /* ================= DOCUMENT ================= */

    const documents = { ...student.documents };

    const docFields = [
      "reportCard",
      "tc",
      "samagraId",
      "nidaCard",
      "previousMarksheet",
      "dobCertificate",
      "aadhaarStudent",
      "aadhaarParent",
      "incomeCertificate",
      "pip",
    ];

    docFields.forEach((field) => {
      if (req.files?.[field]) {
        deleteImageFile(student.documents?.[field]);
        documents[field] = getFilePath(req.files[field]);
      }
    });

    updateData.documents = documents;

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({
      success: true,
      message: "Student updated successfully",
      data: updatedStudent,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= DELETE STUDENT ================= */

exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    deleteImageFile(student.studentPhoto);
    deleteImageFile(student.fatherPhoto);
    deleteImageFile(student.motherPhoto);
    deleteImageFile(student.guardianPhoto);

    Object.values(student.documents || {}).forEach((file) => {
      deleteImageFile(file);
    });

    await student.deleteOne();

    res.json({
      success: true,
      message: "Student deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};