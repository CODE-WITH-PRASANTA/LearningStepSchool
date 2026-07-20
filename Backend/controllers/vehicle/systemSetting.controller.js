const SystemSetting = require("../../models/Vehicle/systemSetting.model");

// ================= CREATE =================
exports.createSystemSetting = async (req, res) => {
  try {
    const exists = await SystemSetting.findOne();

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "System Setting already exists.",
      });
    }

    const setting = await SystemSetting.create(req.body);

    res.status(201).json({
      success: true,
      message: "System Setting Saved Successfully",
      data: setting,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET =================
exports.getSystemSetting = async (req, res) => {
  try {
    const setting = await SystemSetting.findOne();

    res.status(200).json({
      success: true,
      data: setting,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= UPDATE =================
exports.updateSystemSetting = async (req, res) => {
  try {
    const setting = await SystemSetting.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!setting) {
      return res.status(404).json({
        success: false,
        message: "System Setting not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "System Setting Updated Successfully",
      data: setting,
    });
  } catch (error) {
    res.status(500).json({
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

    res.status(200).json({
      success: true,
      message: "Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};