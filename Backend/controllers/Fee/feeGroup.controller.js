const FeeGroup = require("../../models/Fee/feeGroup.model");

// Create Fee Group
exports.createFeeGroup = async (req, res) => {
  try {
    const { headGroup, priority } = req.body;

    const exists = await FeeGroup.findOne({ headGroup });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Fee Group already exists",
      });
    }

    const feeGroup = await FeeGroup.create({
      headGroup,
      priority,
    });

    res.status(201).json({
      success: true,
      data: feeGroup,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Fee Groups
exports.getAllFeeGroups = async (req, res) => {
  try {
    const feeGroups = await FeeGroup.find().sort({ priority: 1 });

    res.status(200).json({
      success: true,
      count: feeGroups.length,
      data: feeGroups,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Fee Group
exports.getFeeGroupById = async (req, res) => {
  try {
    const feeGroup = await FeeGroup.findById(req.params.id);

    if (!feeGroup) {
      return res.status(404).json({
        success: false,
        message: "Fee Group not found",
      });
    }

    res.status(200).json({
      success: true,
      data: feeGroup,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Fee Group
exports.updateFeeGroup = async (req, res) => {
  try {
    const feeGroup = await FeeGroup.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!feeGroup) {
      return res.status(404).json({
        success: false,
        message: "Fee Group not found",
      });
    }

    res.status(200).json({
      success: true,
      data: feeGroup,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Fee Group
exports.deleteFeeGroup = async (req, res) => {
  try {
    const feeGroup = await FeeGroup.findByIdAndDelete(req.params.id);

    if (!feeGroup) {
      return res.status(404).json({
        success: false,
        message: "Fee Group not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Fee Group deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};