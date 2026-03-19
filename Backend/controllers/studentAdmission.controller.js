const Student = require("../models/sudentAdmission.model");
const { deleteImageFile } = require("../middleware/upload");

/* ================= HELPER ================= */

const getFile = (file) => {
  if (!file) return null;
  if (Array.isArray(file)) return file[0];
  return file;
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

    /* FIX ARRAY */
    parseStudentBehaviour(req.body);

    const student = new Student({
      ...req.body,

      studentPhoto: getFile(req.body.studentPhoto),
      fatherPhoto: getFile(req.body.fatherPhoto),
      motherPhoto: getFile(req.body.motherPhoto),
      guardianPhoto: getFile(req.body.guardianPhoto),

      documents: {
        reportCard: getFile(req.body.reportCard),
        tc: getFile(req.body.tc),
        samagraId: getFile(req.body.samagraId),
        nidaCard: getFile(req.body.nidaCard),
        previousMarksheet: getFile(req.body.previousMarksheet),
        dobCertificate: getFile(req.body.dobCertificate),
        aadhaarStudent: getFile(req.body.aadhaarStudent),
        aadhaarParent: getFile(req.body.aadhaarParent),
        incomeCertificate: getFile(req.body.incomeCertificate),
        pip: getFile(req.body.pip)
      }
    });

    await student.save();

    res.status(201).json({
      success: true,
      message: "Student Admission Successful",
      data: student
    });

  } catch (error) {

    console.error("CREATE STUDENT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
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
      data: students
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

/* ================= GET SINGLE STUDENT ================= */

exports.getStudentById = async (req, res) => {
  try {

    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    res.json({
      success: true,
      data: student
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
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
        message: "Student not found"
      });
    }

    /* FIX ARRAY */
    parseStudentBehaviour(req.body);

    const updateData = { ...req.body };

    /* ================= PHOTO UPDATES ================= */

    if (req.files?.studentPhoto) {
      deleteImageFile(student.studentPhoto);
      updateData.studentPhoto = req.files.studentPhoto[0].path;
    }

    if (req.files?.fatherPhoto) {
      deleteImageFile(student.fatherPhoto);
      updateData.fatherPhoto = req.files.fatherPhoto[0].path;
    }

    if (req.files?.motherPhoto) {
      deleteImageFile(student.motherPhoto);
      updateData.motherPhoto = req.files.motherPhoto[0].path;
    }

    if (req.files?.guardianPhoto) {
      deleteImageFile(student.guardianPhoto);
      updateData.guardianPhoto = req.files.guardianPhoto[0].path;
    }

    /* ================= DOCUMENT UPDATES ================= */

    const documents = { ...student.documents };

    if (req.files?.reportCard) {
      deleteImageFile(student.documents?.reportCard);
      documents.reportCard = req.files.reportCard[0].path;
    }

    if (req.files?.tc) {
      deleteImageFile(student.documents?.tc);
      documents.tc = req.files.tc[0].path;
    }

    if (req.files?.samagraId) {
      deleteImageFile(student.documents?.samagraId);
      documents.samagraId = req.files.samagraId[0].path;
    }

    if (req.files?.nidaCard) {
      deleteImageFile(student.documents?.nidaCard);
      documents.nidaCard = req.files.nidaCard[0].path;
    }

    if (req.files?.previousMarksheet) {
      deleteImageFile(student.documents?.previousMarksheet);
      documents.previousMarksheet = req.files.previousMarksheet[0].path;
    }

    if (req.files?.dobCertificate) {
      deleteImageFile(student.documents?.dobCertificate);
      documents.dobCertificate = req.files.dobCertificate[0].path;
    }

    if (req.files?.aadhaarStudent) {
      deleteImageFile(student.documents?.aadhaarStudent);
      documents.aadhaarStudent = req.files.aadhaarStudent[0].path;
    }

    if (req.files?.aadhaarParent) {
      deleteImageFile(student.documents?.aadhaarParent);
      documents.aadhaarParent = req.files.aadhaarParent[0].path;
    }

    if (req.files?.incomeCertificate) {
      deleteImageFile(student.documents?.incomeCertificate);
      documents.incomeCertificate = req.files.incomeCertificate[0].path;
    }

    if (req.files?.pip) {
      deleteImageFile(student.documents?.pip);
      documents.pip = req.files.pip[0].path;
    }

    updateData.documents = documents;

    /* ================= UPDATE ================= */

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({
      success: true,
      message: "Student updated successfully",
      data: updatedStudent
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
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
        message: "Student not found"
      });
    }

    deleteImageFile(student.studentPhoto);
    deleteImageFile(student.fatherPhoto);
    deleteImageFile(student.motherPhoto);
    deleteImageFile(student.guardianPhoto);

    deleteImageFile(student.documents?.reportCard);
    deleteImageFile(student.documents?.tc);
    deleteImageFile(student.documents?.samagraId);
    deleteImageFile(student.documents?.nidaCard);
    deleteImageFile(student.documents?.previousMarksheet);
    deleteImageFile(student.documents?.dobCertificate);
    deleteImageFile(student.documents?.aadhaarStudent);
    deleteImageFile(student.documents?.aadhaarParent);
    deleteImageFile(student.documents?.incomeCertificate);
    deleteImageFile(student.documents?.pip);

    await student.deleteOne();

    res.json({
      success: true,
      message: "Student deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};