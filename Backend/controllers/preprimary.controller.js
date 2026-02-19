const PrePrimary = require("../models/preprimary.model");

/* ================= CREATE ================= */
exports.createActivity = async (req, res) => {
  try {
    const activity = await PrePrimary.create(req.body);
    res.status(201).json(activity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ================= GET ALL ================= */
exports.getActivities = async (req, res) => {
  try {
    const activities = await PrePrimary.find().sort({ hour: 1 });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET SINGLE ================= */
exports.getSingleActivity = async (req, res) => {
  try {
    const activity = await PrePrimary.findById(req.params.id);
    if (!activity)
      return res.status(404).json({ message: "Not found" });

    res.json(activity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ================= UPDATE ================= */
exports.updateActivity = async (req, res) => {
  try {
    const updated = await PrePrimary.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ================= DELETE ================= */
exports.deleteActivity = async (req, res) => {
  try {
    await PrePrimary.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};