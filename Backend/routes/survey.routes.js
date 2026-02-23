const express = require("express");
const router = express.Router();

const {
  submitSurvey,
  getAllSurveys,
} = require("../controllers/survey.controller");

/* ================= ROUTES ================= */

router.post("/submit", submitSurvey);
router.get("/", getAllSurveys);

module.exports = router;