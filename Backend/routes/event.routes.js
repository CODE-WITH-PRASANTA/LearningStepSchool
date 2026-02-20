const express = require("express");
const router = express.Router();
const { upload, convertToWebp } = require("../middleware/upload");

const {
  createEvent,
  getEvents,
  deleteEvent,
  updateEvent,
} = require("../controllers/event.controller");

router.post("/", upload.single("image"), convertToWebp, createEvent);
router.put("/:id", upload.single("image"), convertToWebp, updateEvent);

router.get("/", getEvents);
router.delete("/:id", deleteEvent);

module.exports = router;
