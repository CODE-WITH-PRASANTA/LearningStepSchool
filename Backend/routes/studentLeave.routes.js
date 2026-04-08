const express = require("express");
const router = express.Router();

const {
  createLeave,
  getLeaves,
  getLeaveById,
  updateLeave,
  deleteLeave,
  updateLeaveStatus
} = require("../controllers/studentLeave.controller");

const { upload, convertToWebp } = require("../middleware/upload");

// CREATE
router.post("/", upload.single("file"), convertToWebp, createLeave);

// GET ALL
router.get("/", getLeaves);

// GET ONE
router.get("/:id", getLeaveById);

// UPDATE
router.put("/:id", upload.single("file"), convertToWebp, updateLeave);

router.put("/:id/status", updateLeaveStatus);
// DELETE
router.delete("/:id", deleteLeave);

module.exports = router;