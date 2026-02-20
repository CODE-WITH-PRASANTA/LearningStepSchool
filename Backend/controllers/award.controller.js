const fs = require("fs");
const Award = require("../models/award.model");

/* ================= CREATE ================= */
exports.createAward = async (req, res) => {
  try {
    const { title, image } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const award = await Award.create({
      title,
      image, // 🔥 use body.image (middleware injected)
    });

    res.status(201).json({
      success: true,
      data: award,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= GET ALL ================= */
exports.getAllAwards = async (req, res) => {
  try {
    const awards = await Award.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: awards,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= UPDATE ================= */
exports.updateAward = async (req, res) => {
  try {
    const award = await Award.findById(req.params.id);

    if (!award) {
      return res.status(404).json({
        success: false,
        message: "Award not found",
      });
    }

    const updateData = {
      title: req.body.title,
    };

    // 🔥 if new image uploaded
    if (req.body.image) {
      // delete old image
      if (award.image && fs.existsSync(award.image)) {
        fs.unlinkSync(award.image);
      }

      updateData.image = req.body.image;
    }

    const updated = await Award.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= DELETE ================= */
exports.deleteAward = async (req, res) => {
  try {
    const award = await Award.findById(req.params.id);

    if (!award) {
      return res.status(404).json({
        success: false,
        message: "Award not found",
      });
    }

    // delete image file
    if (award.image && fs.existsSync(award.image)) {
      fs.unlinkSync(award.image);
    }

    await Award.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Award deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};