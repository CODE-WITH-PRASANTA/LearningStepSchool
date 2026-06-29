const FeeHead = require("../../models/Fee/feeHead.model");

exports.createFeeHead = async (req, res) => {
  try {
    const feeHead = await FeeHead.create(req.body);

    res.status(201).json({
      success: true,
      data: feeHead,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllFeeHeads = async (req, res) => {
  try {
    const search = req.query.search || "";

    const feeHeads = await FeeHead.find({
      feeHeadName: {
        $regex: search,
        $options: "i",
      },
    })
      .populate("feeGroup", "headGroup")
      .sort({ priority: 1 });

    res.status(200).json({
      success: true,
      count: feeHeads.length,
      data: feeHeads,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.getFeeHeadById = async (req, res) => {
  try {
    const feeHead = await FeeHead.findById(req.params.id)
      .populate("feeGroup", "headGroup");

    if (!feeHead) {
      return res.status(404).json({
        success: false,
        message: "Fee Head not found",
      });
    }

    res.status(200).json({
      success: true,
      data: feeHead,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateFeeHead = async (req, res) => {
  try {
    const feeHead = await FeeHead.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: feeHead,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteFeeHead = async (req, res) => {
  try {
    await FeeHead.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Fee Head deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};