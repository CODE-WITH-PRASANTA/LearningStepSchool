const mongoose = require("mongoose");

const Student = require("../models/sudentAdmission.model");

const { deleteImageFile } = require("../middleware/upload");

const { closeStudentAcademicSession } = require("./Fee/feeBalance.controller");
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

const getPublicFileUrl = (req, filePath) => {
  if (!filePath) return "";
  if (/^https?:\/\//i.test(filePath)) return filePath;

  const normalizedPath = filePath.replace(/\\/g, "/").replace(/^\/+/, "");
  return `${req.protocol}://${req.get("host")}/${normalizedPath}`;
};

const formatStudentForIdCard = (req, student, session) => {
  const data = student.toJSON();
  const studentName = [data.firstName, data.lastName].filter(Boolean).join(" ");
  const address =
    data.currentAddress || data.permanentAddress || data.guardianAddress || "";
  const phone =
    data.mobile ||
    data.fatherPhone ||
    data.motherPhone ||
    data.guardianPhone ||
    "";

  return {
    _id: data._id,
    id: data._id,
    admissionNo: data.admissionNo || "",
    rollNo: data.rollNumber || "",
    rollNumber: data.rollNumber || "",
    studentName,
    name: studentName,
    firstName: data.firstName || "",
    lastName: data.lastName || "",
    className: data.class || "",
    class: data.class || "",
    section: data.section || "",
    fatherName: data.fatherName || "",
    motherName: data.motherName || "",
    phone,
    mobile: data.mobile || "",
    dob: data.dob || "",
    address,
    session: session || "",
    studentPhoto: data.studentPhoto || "",
    photo: getPublicFileUrl(req, data.studentPhoto),
    gender: data.gender || "",
    category: data.category || "",
    house: data.house || "",
    transport: data.routeList || data.busStop || "",
    status: "Active",
  };
};

/* ================= CREATE STUDENT ================= */

exports.createStudent = async (req, res) => {
  try {
    parseStudentBehaviour(req.body);

    const student = new Student({
      ...req.body,

      // ✅ Admission Session
      session: req.body.session?.trim() || "",

      // ✅ Student Files
      studentPhoto: getFilePath(req.files?.studentPhoto),
      fatherPhoto: getFilePath(req.files?.fatherPhoto),
      motherPhoto: getFilePath(req.files?.motherPhoto),
      guardianPhoto: getFilePath(req.files?.guardianPhoto),

      // ✅ Documents
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

exports.getStudentIdCards = async (req, res) => {
  try {
    const { session, className, section, house, category, gender, transport } =
      req.query;

    const query = {};

    if (className) query.class = className;
    if (section) query.section = section;
    if (house) query.house = house;
    if (category) query.category = category;
    if (gender) query.gender = gender;
    if (transport) {
      query.$or = [{ routeList: transport }, { busStop: transport }];
    }

    const students = await Student.find(query).sort({
      class: 1,
      section: 1,
      rollNumber: 1,
      firstName: 1,
    });

    res.json({
      success: true,
      count: students.length,
      data: students.map((student) =>
        formatStudentForIdCard(req, student, session),
      ),
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

exports.searchStudents = async (req, res) => {
  try {
    const { q } = req.query;

    const students = await Student.find({
      $or: [
        {
          firstName: {
            $regex: q,
            $options: "i",
          },
        },
        {
          admissionNo: {
            $regex: q,
            $options: "i",
          },
        },
      ],
    })
      .select(
        `
        _id
        admissionNo
        firstName
        lastName
        class
        session
        studentPhoto

        fatherName
        fatherMobile
        fatherPhoto

        motherName
        motherMobile
        motherPhoto

        guardianName
        guardianMobile
        guardianPhoto
        address
      `,
      )
      .limit(20);

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({
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

    /* ================= SESSION ================= */

    if (req.body.session !== undefined) {
      updateData.session = req.body.session;
    }

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

    /* ================= UPDATE DATABASE ================= */

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      },
    );

    res.json({
      success: true,
      message: "Student updated successfully",
      data: updatedStudent,
    });
  } catch (error) {
    console.error("UPDATE STUDENT ERROR:", error);

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

/* ================= PROMOTE STUDENTS ================= */

/* =========================================================
   PROMOTE STUDENTS
========================================================= */

exports.promoteStudents = async (req, res) => {
  try {
    const {
      studentIds,
      currentSession,
      currentClass,
      currentDivision,
      promoteSession,
      promoteClass,
      promoteDivision,
    } = req.body;

    /* =====================================================
       VALIDATION
    ===================================================== */

    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one student.",
      });
    }

    if (
      !currentSession ||
      !promoteSession ||
      !promoteClass ||
      !promoteDivision
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Current session, promotion session, class and section are required.",
      });
    }

    /* =====================================================
       NORMALIZE SESSION
    ===================================================== */

    const normalizeSession = (value) => {
      if (!value) return "";

      const session = String(value).trim();

      const match = session.match(/^(\d{4})-(\d{2}|\d{4})$/);

      if (!match) {
        return session.toLowerCase().replace(/\s+/g, "");
      }

      const startYear = match[1];
      const endYear = match[2];

      if (endYear.length === 2) {
        return `${startYear}-${endYear}`;
      }

      return `${startYear}-${endYear.slice(-2)}`;
    };

    /* =====================================================
       NORMALIZE CLASS / SECTION
    ===================================================== */

    const normalizeField = (value) => {
      if (value === null || value === undefined) {
        return "";
      }

      return String(value).trim().toLowerCase().replace(/\s+/g, " ");
    };

    /* =====================================================
       SAME SESSION CHECK
    ===================================================== */

    if (normalizeSession(currentSession) === normalizeSession(promoteSession)) {
      return res.status(400).json({
        success: false,
        message: "Current session and promotion session must be different.",
      });
    }

    /* =====================================================
       SAME CLASS + SECTION CHECK
    ===================================================== */

    if (
      currentClass &&
      currentDivision &&
      normalizeField(currentClass) === normalizeField(promoteClass) &&
      normalizeField(currentDivision) === normalizeField(promoteDivision)
    ) {
      return res.status(400).json({
        success: false,
        message: "Student cannot be promoted to the same class and section.",
      });
    }

    /* =====================================================
       REMOVE DUPLICATE IDS
    ===================================================== */

    const uniqueStudentIds = [...new Set(studentIds.map((id) => String(id)))];

    /* =====================================================
       VALIDATE OBJECT IDS
    ===================================================== */

    for (const studentId of uniqueStudentIds) {
      if (!mongoose.Types.ObjectId.isValid(studentId)) {
        return res.status(400).json({
          success: false,
          message: `Invalid student ID: ${studentId}`,
        });
      }
    }

    /* =====================================================
       FIND STUDENTS
    ===================================================== */

    const students = await Student.find({
      _id: {
        $in: uniqueStudentIds,
      },
    });

    if (students.length !== uniqueStudentIds.length) {
      return res.status(404).json({
        success: false,
        message: "One or more selected students were not found.",
      });
    }

    /* =====================================================
       CLOSE + PROMOTE
    ===================================================== */

    const closedSessions = [];

    const promotedStudents = [];

    for (const student of students) {
      /* ===================================================
         CHECK CURRENT SESSION
      =================================================== */

      if (
        normalizeSession(student.session) !== normalizeSession(currentSession)
      ) {
        return res.status(400).json({
          success: false,
          message: `${student.firstName || "Student"} does not belong to current session ${currentSession}.`,
        });
      }

      /* ===================================================
         CHECK CURRENT CLASS
      =================================================== */

      if (
        currentClass &&
        normalizeField(student.class) !== normalizeField(currentClass)
      ) {
        return res.status(400).json({
          success: false,
          message: `${student.firstName || "Student"} does not belong to class ${currentClass}.`,
        });
      }

      /* ===================================================
         CHECK CURRENT SECTION
      =================================================== */

      if (
        currentDivision &&
        normalizeField(student.section) !== normalizeField(currentDivision)
      ) {
        return res.status(400).json({
          success: false,
          message: `${student.firstName || "Student"} does not belong to section ${currentDivision}.`,
        });
      }

      /* ===================================================
         STEP 1
         CLOSE OLD ACADEMIC YEAR

         This calls:

         calculateSessionBalance()
         ↓
         FeeBalance
         ↓
         closingDue
         ↓
         isClosed = true
      =================================================== */

      const feeBalance = await closeStudentAcademicSession(
        student._id,
        currentSession,
      );

      /* ===================================================
         STEP 2
         PROMOTE STUDENT
      =================================================== */

      const updatedStudent = await Student.findByIdAndUpdate(
        student._id,
        {
          $set: {
            session: promoteSession,

            class: promoteClass,

            section: promoteDivision,
          },
        },
        {
          new: true,
          runValidators: true,
        },
      );

      if (!updatedStudent) {
        throw new Error(`Failed to promote student ${student._id}`);
      }

      /* ===================================================
         CLOSING INFORMATION
      =================================================== */

      closedSessions.push({
        studentId: student._id,

        admissionNo: student.admissionNo || "",

        studentName: [student.firstName, student.lastName]
          .filter(Boolean)
          .join(" "),

        academicYear: feeBalance.academicYear,

        totalFee: Number(feeBalance.totalFee || 0),

        totalPaid: Number(feeBalance.totalPaid || 0),

        totalDiscount: Number(feeBalance.totalDiscount || 0),

        closingDue: Number(feeBalance.closingDue || 0),

        isClosed: feeBalance.isClosed,

        closedAt: feeBalance.closedAt,
      });

      /* ===================================================
         PROMOTION INFORMATION
      =================================================== */

      promotedStudents.push({
        studentId: updatedStudent._id,

        admissionNo: updatedStudent.admissionNo || "",

        studentName: [updatedStudent.firstName, updatedStudent.lastName]
          .filter(Boolean)
          .join(" "),

        previousSession: currentSession,

        newSession: promoteSession,

        previousClass: currentClass,

        newClass: promoteClass,

        previousDivision: currentDivision,

        newDivision: promoteDivision,
      });
    }

    /* =====================================================
       RESPONSE
    ===================================================== */

    return res.status(200).json({
      success: true,

      message: `${promotedStudents.length} student${
        promotedStudents.length > 1 ? "s" : ""
      } promoted successfully and ${currentSession} academic year closed.`,

      data: {
        promotedCount: promotedStudents.length,

        currentSession,

        promoteSession,

        promoteClass,

        promoteDivision,

        closedSessions,

        promotedStudents,
      },
    });
  } catch (error) {
    console.error("PROMOTE STUDENTS ERROR:", error);

    return res.status(500).json({
      success: false,

      message: error.message || "Failed to promote students.",
    });
  }
};
