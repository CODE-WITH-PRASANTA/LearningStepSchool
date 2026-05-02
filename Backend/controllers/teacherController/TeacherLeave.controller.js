const Leave = require("../../models/techerModel/teacherLeve.model");

/* ================= APPLY LEAVE ================= */
exports.applyLeave = async (req, res) => {
  try {
    const { leaveType, fromDate, toDate, reason } = req.body;
    console.log("USER:", req.user);
    // validation
    if (!leaveType || !fromDate || !toDate || !reason) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (new Date(toDate) < new Date(fromDate)) {
      return res.status(400).json({
        message: "'To Date' cannot be before 'From Date'",
      });
    }

    // ❗ prevent overlapping leaves
    const existing = await Leave.findOne({
      teacher: req.user.id,
      $or: [
        {
          fromDate: { $lte: toDate },
          toDate: { $gte: fromDate },
        },
      ],
    });

    if (existing) {
      return res.status(400).json({
        message: "You already applied leave for this period",
      });
    }

    const leave = await Leave.create({
      teacher: req.user.id,
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
    const leaves = await Leave.find({ teacher: req.user.id })
      .populate("teacher", "name email department image")
      .sort({ createdAt: -1 });

    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET ALL LEAVES (ADMIN) ================= */
exports.getAllLeaves = async (req, res) => {
  try {
    // security check
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const leaves = await Leave.find()
      .populate("teacher", "name email department image")
      .sort({ createdAt: -1 });

    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= CREATE LEAVE (ADMIN) ================= */
exports.createLeaveByAdmin = async (req, res) => {
  try {
    const { teacher, leaveType, fromDate, toDate, reason, status, adminNote } =
      req.body;

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (!teacher || !leaveType || !fromDate || !toDate || !reason) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (new Date(toDate) < new Date(fromDate)) {
      return res.status(400).json({
        success: false,
        message: "'To Date' cannot be before 'From Date'",
      });
    }

    if (status && !["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const existing = await Leave.findOne({
      teacher,
      $or: [
        {
          fromDate: { $lte: toDate },
          toDate: { $gte: fromDate },
        },
      ],
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Leave already exists for this teacher in this period",
      });
    }

    const leave = await Leave.create({
      teacher,
      leaveType,
      fromDate,
      toDate,
      reason,
      status: status || "pending",
      adminNote: adminNote || "",
    });

    const populatedLeave = await leave.populate(
      "teacher",
      "name email department image"
    );

    res.status(201).json({
      success: true,
      message: "Leave created successfully",
      data: populatedLeave,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================= UPDATE STATUS (ADMIN TOGGLE) ================= */
exports.updateLeaveStatus = async (req, res) => {
    try {
      const { status, adminNote } = req.body;
  
      if (req.user.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }
  
      const leave = await Leave.findByIdAndUpdate(
        req.params.id,
        {
          status,
          adminNote: adminNote || "",
        },
        { new: true }
      ).populate("teacher", "name email department image");
  
      if (!leave) {
        return res.status(404).json({
          success: false,
          message: "Leave not found",
        });
      }
  
      // 🔥 IMPORTANT RESPONSE
      res.json({
        success: true,
        message: `Leave ${status} successfully`,
        data: leave,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };

/* ================= DELETE LEAVE ================= */
exports.deleteLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave not found",
      });
    }

    const isAdmin = req.user.role === "admin";
    const isOwner = leave.teacher.toString() === req.user.id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (!isAdmin && leave.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending leaves can be deleted",
      });
    }

    await leave.deleteOne();

    res.json({
      success: true,
      message: "Leave deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
