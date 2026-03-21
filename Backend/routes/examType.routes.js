const express = require("express");
const router = express.Router();

const {
  createExamType,
  getExamTypes,
  getPublishedExamTypes, // ✅ NEW
  togglePublish,
  deleteExamType,
} = require("../controllers/examType.controller");

// ADMIN
router.post("/", createExamType);
router.get("/", getExamTypes);

// STUDENT (dropdown)
router.get("/published", getPublishedExamTypes); // ✅ IMPORTANT

// ACTIONS
router.put("/toggle/:id", togglePublish);
router.delete("/:id", deleteExamType);

module.exports = router;