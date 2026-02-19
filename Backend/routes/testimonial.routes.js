const express = require("express");
const router = express.Router();

const {
  createTestimonial,
  getTestimonials,
  updateTestimonial,
  deleteTestimonial,
} = require("../controllers/testimonial.controller");

const { upload, convertToWebp } = require("../middleware/upload");

/* ================= CREATE ================= */
router.post(
  "/",
  upload.single("photo"),
  convertToWebp,
  createTestimonial
);

/* ================= GET ALL ================= */
router.get("/", getTestimonials);

/* ================= UPDATE ================= */
router.put(
  "/:id",
  upload.single("photo"),
  convertToWebp,
  updateTestimonial
);

/* ================= DELETE ================= */
router.delete("/:id", deleteTestimonial);

module.exports = router;