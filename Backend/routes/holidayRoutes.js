const express = require("express");

const router = express.Router();

const {
  createHoliday,
  getHolidays,
  getHolidayById,
  updateHoliday,
  deleteHoliday,
} = require("../controllers/holidayController");

// Add holiday
router.post("/", createHoliday);

// Get holidays
router.get("/", getHolidays);

// Get one holiday
router.get("/:id", getHolidayById);

// Update holiday
router.put("/:id", updateHoliday);

// Delete holiday
router.delete("/:id", deleteHoliday);

module.exports = router;