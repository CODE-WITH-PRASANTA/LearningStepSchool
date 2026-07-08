const FeeStructure = require("../../models/Fee/feeStructure.models");


exports.createFeeStructure = async (req, res) => {
  try {
    const feeStructure = await FeeStructure.create(req.body);

    res.status(201).json({
      success: true,
      data: feeStructure,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllFeeStructures = async (req, res) => {
  try {
    const search = (req.query.search || "").trim();

    let filter = {
      isActive: true,
    };

    if (search) {
      filter.$or = [
        {
          className: {
            $regex: search,
            $options: "i",
          },
        },
        {
          stream: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    console.log("Search =>", search);
    console.log("Filter =>", filter);

    const feeStructures = await FeeStructure.find(filter)
      .populate("feeItems.feeHead", "feeHeadName")
      .sort({ className: 1 });

    console.log("Found =>", feeStructures.length);

    res.status(200).json({
      success: true,
      count: feeStructures.length,
      data: feeStructures,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.getFeeStructureById = async (req, res) => {
  try {
    const feeStructure = await FeeStructure.findById(
      req.params.id
    ).populate(
      "feeItems.feeHead",
      "feeHeadName"
    );

    res.status(200).json({
      success: true,
      data: feeStructure,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.updateFeeStructure = async (req, res) => {
  try {
    const feeStructure =
      await FeeStructure.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    res.status(200).json({
      success: true,
      data: feeStructure,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.deleteFeeStructure = async (req, res) => {
  try {
    await FeeStructure.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message:
        "Fee Structure deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};