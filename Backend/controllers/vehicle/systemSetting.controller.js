
const SystemSetting = require("../../models/Vehicle/systemSetting.model");

// ================= CREATE =================
exports.createSystemSetting = async (req, res) => {
  try {
    const {
      vehicle,
      minMileage,
      dieselRate,
      minDailyKm,
      maxDailyKm,
      description,
    } = req.body;

    if (!vehicle) {
      return res.status(400).json({
        success: false,
        message: "Please select a vehicle.",
      });
    }

    if (
      minDailyKm !== undefined &&
      maxDailyKm !== undefined &&
      Number(maxDailyKm) < Number(minDailyKm)
    ) {
      return res.status(400).json({
        success: false,
        message: "Maximum daily KM cannot be less than minimum daily KM.",
      });
    }

    const exists = await SystemSetting.findOne({ vehicle });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Setting already exists for this vehicle.",
      });
    }

    const setting = await SystemSetting.create({
      vehicle,
      minMileage,
      dieselRate,
      minDailyKm,
      maxDailyKm,
      description: description || "",
    });

    const populatedSetting = await SystemSetting.findById(setting._id)
      .populate("vehicle", "vehicleNo vehicleType driver");

    return res.status(201).json({
      success: true,
      message: "System Setting Saved Successfully",
      data: populatedSetting,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Setting already exists for this vehicle.",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET ALL =================
exports.getSystemSetting = async (req, res) => {
  try {
    const settings = await SystemSetting.find()
      .populate("vehicle", "vehicleNo vehicleType driver")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET BY ID =================
exports.getSystemSettingById = async (req, res) => {
  try {
    const setting = await SystemSetting.findById(req.params.id)
      .populate("vehicle", "vehicleNo vehicleType driver");

    if (!setting) {
      return res.status(404).json({
        success: false,
        message: "System Setting not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: setting,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= UPDATE =================
exports.updateSystemSetting = async (req, res) => {
  try {
    const {
      vehicle,
      minMileage,
      dieselRate,
      minDailyKm,
      maxDailyKm,
      description,
    } = req.body;

    if (
      minDailyKm !== undefined &&
      maxDailyKm !== undefined &&
      Number(maxDailyKm) < Number(minDailyKm)
    ) {
      return res.status(400).json({
        success: false,
        message: "Maximum daily KM cannot be less than minimum daily KM.",
      });
    }

    // Prevent assigning a vehicle already used by another setting.
    if (vehicle) {
      const duplicate = await SystemSetting.findOne({
        vehicle,
        _id: { $ne: req.params.id },
      });

      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: "Setting already exists for this vehicle.",
        });
      }
    }

    const updateData = {};

    if (vehicle !== undefined) updateData.vehicle = vehicle;
    if (minMileage !== undefined) updateData.minMileage = minMileage;
    if (dieselRate !== undefined) updateData.dieselRate = dieselRate;
    if (minDailyKm !== undefined) updateData.minDailyKm = minDailyKm;
    if (maxDailyKm !== undefined) updateData.maxDailyKm = maxDailyKm;

    // Save the description, including an intentionally empty string.
    if (description !== undefined) {
      updateData.description = description;
    }

    const setting = await SystemSetting.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    ).populate("vehicle", "vehicleNo vehicleType driver");

    if (!setting) {
      return res.status(404).json({
        success: false,
        message: "System Setting not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "System Setting Updated Successfully",
      data: setting,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Setting already exists for this vehicle.",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= DELETE =================
exports.deleteSystemSetting = async (req, res) => {
  try {
    const setting = await SystemSetting.findByIdAndDelete(req.params.id);

    if (!setting) {
      return res.status(404).json({
        success: false,
        message: "System Setting not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Deleted Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
