const express = require("express");
const router = express.Router();

const {
  createResult,
  getResults,
  updateResult,
  deleteResult,
  searchResult
} = require("../controllers/examResult.controller");

// ✅ CREATE
router.post("/", createResult);

// ✅ GET ALL
router.get("/", getResults);

// ✅ SEARCH (IMPORTANT)
router.get("/search", searchResult);

// ✅ UPDATE
router.put("/:id", updateResult);

// ✅ DELETE
router.delete("/:id", deleteResult);

module.exports = router;