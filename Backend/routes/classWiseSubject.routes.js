const express = require("express");
const router = express.Router();

const {
  addSubjects,
  getAll,
  getByClass,
  removeSubject,
  deleteClassSubjects,
} = require("../controllers/classWiseSubject.controller");


// ✅ CREATE / UPDATE
router.post("/", addSubjects);

// ✅ GET ALL
router.get("/", getAll);

// ✅ GET BY CLASS
router.get("/:classId", getByClass);

// ✅ REMOVE SINGLE SUBJECT
router.put("/remove", removeSubject);

// ✅ DELETE CLASS RECORD
router.delete("/:id", deleteClassSubjects);

module.exports = router;