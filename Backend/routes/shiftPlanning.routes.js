const express = require("express");

const router = express.Router();

const {
  createShift,
  getAllShifts,
  getShiftById,
  updateShift,
  deleteShift,
  getMyShiftSchedule
} = require("../controllers/shiftPlanning.controller");

const auth = require("../middleware/authMiddleware");

router.post("/", auth, createShift);

router.get("/", auth, getAllShifts);
router.get("/my-schedule", auth, getMyShiftSchedule);

router.get("/:id", auth, getShiftById);

router.put("/:id", auth, updateShift);

router.delete("/:id", auth, deleteShift);

module.exports = router;