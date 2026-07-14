const ShiftPlanning = require("../models/shiftPlanning.model");
const User = require("../models/techerModel/createteacher.model");

/* =========================================================
   CREATE SHIFT
========================================================= */

exports.createShift = async (req, res) => {
  try {
    const {
      teacherId,
      shiftType,
      startTime,
      endTime,
      date,
      department,
      status,
    } = req.body;

    if (
      !teacherId ||
      !shiftType ||
      !startTime ||
      !endTime ||
      !date ||
      !department
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields are required",
      });
    }

    const teacher = await User.findById(teacherId);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    const existingShift = await ShiftPlanning.findOne({
      teacherId,
      date: new Date(date),
    });

    if (existingShift) {
      return res.status(400).json({
        success: false,
        message: "Teacher already has a shift for this date",
      });
    }

    const shift = await ShiftPlanning.create({
      teacherId,
      shiftType,
      startTime,
      endTime,
      date,
      department,
      status: status || "Scheduled",
    });

    const populatedShift = await ShiftPlanning.findById(
      shift._id
    ).populate(
      "teacherId",
      "name email image department"
    );

    return res.status(201).json({
      success: true,
      message: "Shift created successfully",
      data: populatedShift,
    });
  } catch (error) {
    console.error("CREATE SHIFT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* =========================================================
   GET ALL SHIFTS
========================================================= */

exports.getAllShifts = async (req, res) => {
  try {
    const {
      search = "",
      status,
      shiftType,
      department,
      date,
    } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (shiftType) {
      filter.shiftType = shiftType;
    }

    if (department) {
      filter.department = department;
    }

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      filter.date = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    let shifts = await ShiftPlanning.find(filter)
      .populate(
        "teacherId",
        "name email image department"
      )
      .sort({
        date: -1,
        startTime: 1,
      });

    if (search) {
      const searchText = search.toLowerCase();

      shifts = shifts.filter((shift) => {
        return (
          shift.teacherId?.name
            ?.toLowerCase()
            .includes(searchText) ||
          shift.department
            ?.toLowerCase()
            .includes(searchText) ||
          shift.shiftType
            ?.toLowerCase()
            .includes(searchText) ||
          shift.status
            ?.toLowerCase()
            .includes(searchText)
        );
      });
    }

    return res.status(200).json({
      success: true,
      count: shifts.length,
      data: shifts,
    });
  } catch (error) {
    console.error("GET SHIFTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* =========================================================
   GET SINGLE SHIFT
========================================================= */

exports.getShiftById = async (req, res) => {
  try {
    const shift = await ShiftPlanning.findById(
      req.params.id
    ).populate(
      "teacherId",
      "name email image department"
    );

    if (!shift) {
      return res.status(404).json({
        success: false,
        message: "Shift not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: shift,
    });
  } catch (error) {
    console.error("GET SHIFT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================================
   GET MY SHIFT SCHEDULE - TEACHER
========================================================= */

exports.getMyShiftSchedule = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const shifts = await ShiftPlanning.find({
      teacherId,
    })
      .populate(
        "teacherId",
        "name email image department"
      )
      .sort({
        date: 1,
        startTime: 1,
      });

    return res.status(200).json({
      success: true,
      count: shifts.length,
      data: shifts,
    });
  } catch (error) {
    console.error(
      "GET MY SHIFT SCHEDULE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================================
   UPDATE SHIFT
========================================================= */

exports.updateShift = async (req, res) => {
  try {
    const shift = await ShiftPlanning.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate(
      "teacherId",
      "name email image department"
    );

    if (!shift) {
      return res.status(404).json({
        success: false,
        message: "Shift not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Shift updated successfully",
      data: shift,
    });
  } catch (error) {
    console.error("UPDATE SHIFT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* =========================================================
   DELETE SHIFT
========================================================= */

exports.deleteShift = async (req, res) => {
  try {
    const shift = await ShiftPlanning.findByIdAndDelete(
      req.params.id
    );

    if (!shift) {
      return res.status(404).json({
        success: false,
        message: "Shift not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Shift deleted successfully",
    });
  } catch (error) {
    console.error("DELETE SHIFT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};