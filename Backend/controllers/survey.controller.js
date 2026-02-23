const Survey = require("../models/survey.model");

/* ================= SUBMIT ================= */
exports.submitSurvey = async (req, res) => {
  try {
    const { parentName, mobile } = req.body;

    if (!parentName || !mobile) {
      return res.status(400).json({
        success: false,
        message: "Parent Name and Mobile are required",
      });
    }

    const survey = await Survey.create(req.body);

    res.status(201).json({
      success: true,
      message: "Survey submitted successfully",
      data: survey,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* ================= GET ALL ================= */
exports.getAllSurveys = async (req, res) => {
  try {
    const surveys = await Survey.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: surveys,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};