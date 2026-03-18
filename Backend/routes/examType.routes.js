const express = require("express");
const router = express.Router();

const {
  createExamType,
  getExamTypes,
  togglePublish,
  deleteExamType
} = require("../controllers/examType.controller");

router.post("/", createExamType);
router.get("/", getExamTypes);
router.put("/toggle/:id", togglePublish);
router.delete("/:id", deleteExamType);

module.exports = router;