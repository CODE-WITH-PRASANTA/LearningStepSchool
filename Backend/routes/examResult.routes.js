const express = require("express");
const router = express.Router();

const {
  createResult,
  getResults,
  updateResult,
  deleteResult,
  searchResult,
  getStudentAllResults,
} = require("../controllers/examResult.controller");

// ✅ CREATE
router.post("/", createResult);

// ✅ GET ALL
router.get("/", getResults);

// ✅ SEARCH (IMPORTANT)
router.get("/search", searchResult);

// NEW ROUTE
router.get("/student/:admissionNo", getStudentAllResults);

// ✅ UPDATE
router.put("/:id", updateResult);

// ✅ DELETE
router.delete("/:id", deleteResult);

module.exports = router;