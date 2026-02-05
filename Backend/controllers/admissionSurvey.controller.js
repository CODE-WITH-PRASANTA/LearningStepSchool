const AdmissionSurvey = require("../models/AdmissionSurvey.model");

/**
 * CREATE SURVEY
 */
const createSurvey = async (req, res) => {
  try {
    const data = req.body;

    if (!data.parentName || !data.mobile) {
      return res.status(400).json({
        success: false,
        message: "Parent name and mobile are required",
      });
    }

    const applicationNo =
      "APP-" + Math.floor(100000 + Math.random() * 900000);

    const survey = new AdmissionSurvey({
      ...data,
      applicationNo,
    });

    await survey.save();

    return res.status(201).json({
      success: true,
      message: "Survey submitted successfully",
      data: survey,
    });
  } catch (error) {
    console.error("Survey Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * GET ALL SURVEYS (ADMIN)
 */
const getAllSurveys = async (req, res) => {
  try {
    const surveys = await AdmissionSurvey.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: surveys.length,
      data: surveys,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch surveys",
    });
  }
};

module.exports = {
  createSurvey,
  getAllSurveys,
};
