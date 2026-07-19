const Overtime = require(
  "../../models/techerModel/teacherOvertime.model"
);

/* ================= CREATE OVERTIME ================= */

exports.createOvertime = async (req, res) => {
  try {
    const { date, hours, reason } = req.body;

    if (!date || !hours || !reason) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (Number(hours) < 0.5) {
      return res.status(400).json({
        success: false,
        message: "Minimum overtime is 0.5 hours",
      });
    }

    const existingOvertime = await Overtime.findOne({
      teacher: req.user.id,
      date: new Date(date),
    });

    if (existingOvertime) {
      return res.status(400).json({
        success: false,
        message:
          "Overtime request already exists for this date",
      });
    }

    const overtime = await Overtime.create({
      teacher: req.user.id,
      date,
      hours: Number(hours),
      reason,
    });

    const populatedOvertime = await overtime.populate(
      "teacher",
      "name email department image"
    );

    res.status(201).json({
      success: true,
      message: "Overtime request submitted successfully",
      data: populatedOvertime,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================= GET MY OVERTIME ================= */

exports.getMyOvertimes = async (req, res) => {
  try {
    const overtimes = await Overtime.find({
      teacher: req.user.id,
    })
      .populate(
        "teacher",
        "name email department image"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: overtimes,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================= GET OVERTIME BY ID ================= */

exports.getOvertimeById = async (req, res) => {
  try {
    const overtime = await Overtime.findOne({
      _id: req.params.id,
      teacher: req.user.id,
    }).populate(
      "teacher",
      "name email department image"
    );

    if (!overtime) {
      return res.status(404).json({
        success: false,
        message: "Overtime request not found",
      });
    }

    res.status(200).json({
      success: true,
      data: overtime,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================= UPDATE OVERTIME ================= */

exports.updateOvertime = async (req, res) => {
  try {
    const { date, hours, reason } = req.body;

    const overtime = await Overtime.findOne({
      _id: req.params.id,
      teacher: req.user.id,
    });

    if (!overtime) {
      return res.status(404).json({
        success: false,
        message: "Overtime request not found",
      });
    }

    if (overtime.status !== "pending") {
      return res.status(400).json({
        success: false,
        message:
          "Only pending overtime requests can be edited",
      });
    }

    if (!date || !hours || !reason) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (Number(hours) < 0.5) {
      return res.status(400).json({
        success: false,
        message: "Minimum overtime is 0.5 hours",
      });
    }

    const duplicate = await Overtime.findOne({
      teacher: req.user.id,
      date: new Date(date),
      _id: {
        $ne: req.params.id,
      },
    });

    if (duplicate) {
      return res.status(400).json({
        success: false,
        message:
          "Overtime request already exists for this date",
      });
    }

    overtime.date = date;
    overtime.hours = Number(hours);
    overtime.reason = reason;

    await overtime.save();

    res.status(200).json({
      success: true,
      message: "Overtime request updated successfully",
      data: overtime,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================= DELETE OVERTIME ================= */

exports.deleteOvertime = async (req, res) => {
  try {
    const overtime = await Overtime.findOne({
      _id: req.params.id,
      teacher: req.user.id,
    });

    if (!overtime) {
      return res.status(404).json({
        success: false,
        message: "Overtime request not found",
      });
    }

    if (overtime.status !== "pending") {
      return res.status(400).json({
        success: false,
        message:
          "Only pending overtime requests can be deleted",
      });
    }

    await overtime.deleteOne();

    res.status(200).json({
      success: true,
      message: "Overtime request deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================= ADMIN GET ALL ================= */

exports.getAllOvertimes = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const overtimes = await Overtime.find()
      .populate(
        "teacher",
        "name email department image"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: overtimes,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================= ADMIN UPDATE STATUS ================= */

exports.updateOvertimeStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (
      !["pending", "approved", "rejected"].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const overtime = await Overtime.findByIdAndUpdate(
      req.params.id,
      {
        status,
        adminNote: adminNote || "",
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate(
      "teacher",
      "name email department image"
    );

    if (!overtime) {
      return res.status(404).json({
        success: false,
        message: "Overtime request not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Overtime ${status} successfully`,
      data: overtime,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};