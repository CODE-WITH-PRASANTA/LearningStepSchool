const StudentLeave = require("../models/StudentLeave.model");
const { deleteImageFile } = require("../middleware/upload");

/* ================= CREATE LEAVE ================= */
exports.createLeave = async (req, res) => {
  try {
    const {
      className,
      section,
      student,
      leaveFrom,
      leaveTo,
      description,
      file,
    } = req.body;

    if (!className || !section || !student || !leaveFrom || !leaveTo || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const leave = await StudentLeave.create({
      className,
      section,
      student,
      leaveFrom,
      leaveTo,
      description,
      file: file || "",
      status: "Pending", // ✅ default status
    });

    res.status(201).json({
      success: true,
      message: "Leave created successfully",
      data: leave,
    });
  } catch (error) {
    console.error("CREATE LEAVE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET ALL LEAVES ================= */
exports.getLeaves = async (req, res) => {
  try {
    const leaves = await StudentLeave.find()
      .populate("student", "firstName lastName")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: leaves.length,
      data: leaves,
    });
  } catch (error) {
    console.error("GET LEAVES ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET SINGLE LEAVE ================= */
exports.getLeaveById = async (req, res) => {
  try {
    const leave = await StudentLeave.findById(req.params.id)
      .populate("student", "firstName lastName");

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave not found",
      });
    }

    res.json({
      success: true,
      data: leave,
    });
  } catch (error) {
    console.error("GET SINGLE LEAVE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= UPDATE LEAVE ================= */
exports.updateLeave = async (req, res) => {
  try {
    const leave = await StudentLeave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave not found",
      });
    }

    // ✅ delete old file if new uploaded
    if (req.body.file && leave.file) {
      deleteImageFile(leave.file);
    }

    const updatedLeave = await StudentLeave.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    ).populate("student", "firstName lastName");

    res.json({
      success: true,
      message: "Leave updated successfully",
      data: updatedLeave,
    });
  } catch (error) {
    console.error("UPDATE LEAVE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= UPDATE STATUS ================= */
exports.updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Pending", "Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const leave = await StudentLeave.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("student", "firstName lastName");

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave not found",
      });
    }

    res.json({
      success: true,
      message: "Status updated successfully",
      data: leave,
    });
  } catch (error) {
    console.error("STATUS UPDATE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= DELETE LEAVE ================= */
exports.deleteLeave = async (req, res) => {
  try {
    const leave = await StudentLeave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave not found",
      });
    }

    if (leave.file) {
      deleteImageFile(leave.file);
    }

    await leave.deleteOne();

    res.json({
      success: true,
      message: "Leave deleted successfully",
    });
  } catch (error) {
    console.error("DELETE LEAVE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};