// routes/attendance.routes.js
const express = require("express");
const router = express.Router();

const {
  getAttendance,
  saveAttendance,
} = require("../controllers/attendance.controller");

// GET (load attendance)
router.get("/", getAttendance);

// POST (save attendance)
router.post("/", saveAttendance);

module.exports = router;