const StaffGatePass = require("../models/staffGatePass.model");
const Teacher = require("../models/techerModel/createteacher.model");

const buildTeacherSnapshot = (teacher) => ({
  teacherId: teacher._id,
  name: teacher.name || "",
  designation: teacher.role === "admin" ? "Admin" : "Teacher",
  department: teacher.department || "",
  contact: teacher.contact || "",
  photo: teacher.image || "",
});

exports.createStaffGatePass = async (req, res) => {
  try {
    const { teacherId, date, time, reason, remark } = req.body;

    if (!teacherId || !date || !time || !reason) {
      return res.status(400).json({
        success: false,
        message: "Staff, date, time and reason are required",
      });
    }

    const teacher = await Teacher.findById(teacherId).select("-password");

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Staff not found",
      });
    }

    const gatePass = await StaffGatePass.create({
      ...buildTeacherSnapshot(teacher),
      date,
      time,
      reason,
      remark,
    });

    res.status(201).json({
      success: true,
      message: "Staff gate pass created successfully",
      data: gatePass,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getStaffGatePasses = async (req, res) => {
  try {
    const gatePasses = await StaffGatePass.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: gatePasses.length,
      data: gatePasses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getStaffGatePassById = async (req, res) => {
  try {
    const gatePass = await StaffGatePass.findById(req.params.id);

    if (!gatePass) {
      return res.status(404).json({
        success: false,
        message: "Staff gate pass not found",
      });
    }

    res.status(200).json({
      success: true,
      data: gatePass,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateStaffGatePass = async (req, res) => {
  try {
    const { date, time, reason, remark } = req.body;

    const gatePass = await StaffGatePass.findByIdAndUpdate(
      req.params.id,
      { date, time, reason, remark },
      { new: true, runValidators: true },
    );

    if (!gatePass) {
      return res.status(404).json({
        success: false,
        message: "Staff gate pass not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Staff gate pass updated successfully",
      data: gatePass,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteStaffGatePass = async (req, res) => {
  try {
    const gatePass = await StaffGatePass.findByIdAndDelete(req.params.id);

    if (!gatePass) {
      return res.status(404).json({
        success: false,
        message: "Staff gate pass not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Staff gate pass deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
