const express = require("express");
const router = express.Router();

const {
  upload,
  convertToWebp
} = require("../middleware/upload");

const {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent
} = require("../controllers/studentAdmission.controller");


/* ================= FILE FIELDS ================= */
const uploadFields = upload.fields([

  /* PHOTOS */
  { name: "studentPhoto", maxCount: 1 },
  { name: "fatherPhoto", maxCount: 1 },
  { name: "motherPhoto", maxCount: 1 },
  { name: "guardianPhoto", maxCount: 1 },

  /* DOCUMENTS */
  { name: "reportCard", maxCount: 1 },
  { name: "tc", maxCount: 1 },
  { name: "samagraId", maxCount: 1 },
  { name: "nidaCard", maxCount: 1 },
  { name: "previousMarksheet", maxCount: 1 },
  { name: "dobCertificate", maxCount: 1 },
  { name: "aadhaarStudent", maxCount: 1 },
  { name: "aadhaarParent", maxCount: 1 },
  { name: "incomeCertificate", maxCount: 1 },
  { name: "pip", maxCount: 1 }

]);


/* ================= ROUTES ================= */

router.post(
  "/",
  uploadFields,
  convertToWebp,
  createStudent
);

router.get("/", getStudents);

router.get("/:id", getStudentById);

router.put(
  "/:id",
  uploadFields,
  convertToWebp,
  updateStudent
);

router.delete("/:id", deleteStudent);

module.exports = router;