const express = require("express");
const {
  createSurvey,
  getAllSurveys,
} = require("../controllers/admissionSurvey.controller");

const router = express.Router();

router.post("/submit", createSurvey);
router.get("/all", getAllSurveys);

module.exports = router;
