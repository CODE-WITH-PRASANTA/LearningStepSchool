const Popup = require("../models/popup.model");
const {
  deleteImageFile,
} = require("../middleware/upload");

/* ================= CREATE ================= */

exports.createPopup = async (req, res) => {
  try {
    const popup = await Popup.create({
      title: req.body.title,
      description: req.body.description,
      fromDate: req.body.fromDate,
      toDate: req.body.toDate,
      videoUrl: req.body.videoUrl,
      image: req.body.image,
    });

    res.status(201).json({
      success: true,
      message: "Popup Created Successfully",
      data: popup,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET ALL ================= */

exports.getAllPopup = async (req, res) => {
  try {
    const popup = await Popup.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: popup.length,
      data: popup,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET SINGLE ================= */

exports.getPopupById = async (req, res) => {
  try {
    const popup = await Popup.findById(
      req.params.id
    );

    if (!popup) {
      return res.status(404).json({
        success: false,
        message: "Popup not found",
      });
    }

    res.status(200).json({
      success: true,
      data: popup,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= UPDATE ================= */

exports.updatePopup = async (req, res) => {
  try {
    const popup = await Popup.findById(
      req.params.id
    );

    if (!popup) {
      return res.status(404).json({
        success: false,
        message: "Popup not found",
      });
    }

    const updateData = {
      title: req.body.title,
      description: req.body.description,
      fromDate: req.body.fromDate,
      toDate: req.body.toDate,
      videoUrl: req.body.videoUrl,
    };

    if (req.body.image) {
      deleteImageFile(popup.image);

      updateData.image = req.body.image;
    }

    const updatedPopup =
      await Popup.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

    res.status(200).json({
      success: true,
      message: "Popup Updated Successfully",
      data: updatedPopup,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= DELETE ================= */

exports.deletePopup = async (req, res) => {
  try {
    const popup = await Popup.findById(
      req.params.id
    );

    if (!popup) {
      return res.status(404).json({
        success: false,
        message: "Popup not found",
      });
    }

    if (popup.image) {
      deleteImageFile(popup.image);
    }

    await Popup.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Popup Deleted Successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};