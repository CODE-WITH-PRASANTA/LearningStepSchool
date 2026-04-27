const express = require("express");
const router = express.Router();

const controller = require("../controllers/examResult.controller");

const {
  createResult,
  getResults,
  updateResult,
  deleteResult,
  searchResult,
  getStudentAllResults,
  fixResultsData,
} = controller;

// ✅ CREATE
router.post("/", createResult);

// ✅ GET ALL
router.get("/", getResults);

// ✅ SEARCH
router.get("/search", searchResult);

// ✅ STUDENT REPORT
router.get("/student/:admissionNo", getStudentAllResults);

// 🔥 ADD THIS (IMPORTANT)
router.get("/fix", fixResultsData);

// ✅ UPDATE
router.put("/:id", updateResult);

// ✅ DELETE
router.delete("/:id", deleteResult);

module.exports = router;