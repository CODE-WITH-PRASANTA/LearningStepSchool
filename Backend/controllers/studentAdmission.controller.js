const Student = require("../models/sudentAdmission.model");
const { deleteImageFile } = require("../middleware/upload");

/* ================= HELPER ================= */
const getFile = (file) => {
  if (!file) return null;
  if (Array.isArray(file)) return file[0];
  return file;
};

/* ================= CREATE STUDENT ================= */
exports.createStudent = async (req, res) => {
  try {

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

    /* DELETE OLD FILES IF NEW UPLOADED */

    if (req.body.studentPhoto) {
      deleteImageFile(student.studentPhoto);
    }

    if (req.body.fatherPhoto) {
      deleteImageFile(student.fatherPhoto);
    }

    if (req.body.motherPhoto) {
      deleteImageFile(student.motherPhoto);
    }

    if (req.body.guardianPhoto) {
      deleteImageFile(student.guardianPhoto);
    }

    /* DOCUMENTS */

    if (req.body.reportCard) {
      deleteImageFile(student.documents?.reportCard);
    }

    if (req.body.tc) {
      deleteImageFile(student.documents?.tc);
    }

    if (req.body.samagraId) {
      deleteImageFile(student.documents?.samagraId);
    }

    if (req.body.nidaCard) {
      deleteImageFile(student.documents?.nidaCard);
    }

    if (req.body.previousMarksheet) {
      deleteImageFile(student.documents?.previousMarksheet);
    }

    if (req.body.dobCertificate) {
      deleteImageFile(student.documents?.dobCertificate);
    }

    if (req.body.aadhaarStudent) {
      deleteImageFile(student.documents?.aadhaarStudent);
    }

    if (req.body.aadhaarParent) {
      deleteImageFile(student.documents?.aadhaarParent);
    }

    if (req.body.incomeCertificate) {
      deleteImageFile(student.documents?.incomeCertificate);
    }

    if (req.body.pip) {
      deleteImageFile(student.documents?.pip);
    }

    /* UPDATE DATA */

    const updateData = {
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
    };

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

    /* DELETE PHOTOS */

    deleteImageFile(student.studentPhoto);
    deleteImageFile(student.fatherPhoto);
    deleteImageFile(student.motherPhoto);
    deleteImageFile(student.guardianPhoto);

    /* DELETE DOCUMENTS */

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