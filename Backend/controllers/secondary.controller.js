const Secondary = require("../models/secondary.model");

/* ================= CREATE ================= */
exports.createActivity = async (req, res) => {
  try {
    const { hour, activity } = req.body;

    if (!hour || !activity) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newActivity = await Secondary.create({ hour, activity });
    res.status(201).json(newActivity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET ALL ================= */
exports.getActivities = async (req, res) => {
  try {
    const activities = await Secondary.find().sort({ hour: 1 });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET SINGLE ================= */
exports.getSingleActivity = async (req, res) => {
  try {
    const activity = await Secondary.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    res.json(activity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ================= UPDATE ================= */
exports.updateActivity = async (req, res) => {
  try {
    const { hour, activity } = req.body;

    if (!hour || !activity) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const updated = await Secondary.findByIdAndUpdate(
      req.params.id,
      { hour, activity },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Activity not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ================= DELETE ================= */
exports.deleteActivity = async (req, res) => {
  try {
    const deleted = await Secondary.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Activity not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};