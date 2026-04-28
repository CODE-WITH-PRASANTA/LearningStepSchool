const Leave = require("../../models/techerModel/teacherLeve.model");

/* ================= APPLY LEAVE ================= */
exports.applyLeave = async (req, res) => {
  try {
    const { leaveType, fromDate, toDate, reason } = req.body;

    if (!leaveType || !fromDate || !toDate || !reason) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (new Date(toDate) < new Date(fromDate)) {
      return res.status(400).json({
        message: "'To Date' cannot be before 'From Date'",
      });
    }

    const leave = await Leave.create({
      teacher: req.user.id, // from auth middleware
      leaveType,
      fromDate,
      toDate,
      reason,
    });

    res.status(201).json(leave);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET MY LEAVES ================= */
exports.getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ teacher: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};