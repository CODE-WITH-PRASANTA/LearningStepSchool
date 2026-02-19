const Primery = require("../models/primery.model");

/* ================= CREATE ================= */
exports.createActivity = async (req, res) => {
  try {
    const { hour, activity } = req.body;

    if (!hour || !activity) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newActivity = await Primery.create({ hour, activity });

    res.status(201).json(newActivity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================= GET ALL ================= */
exports.getActivities = async (req, res) => {
  try {
    const activities = await Primery.find();

    // Safe numeric time sort (100% correct)
    const sorted = activities.sort((a, b) => {
      const [aHour, aMin] = a.hour.split(":").map(Number);
      const [bHour, bMin] = b.hour.split(":").map(Number);

      if (aHour !== bHour) return aHour - bHour;
      return aMin - bMin;
    });

    res.json(sorted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================= GET SINGLE ================= */
exports.getSingleActivity = async (req, res) => {
  try {
    const activity = await Primery.findById(req.params.id);

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

    const updated = await Primery.findByIdAndUpdate(
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
    const deleted = await Primery.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Activity not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};