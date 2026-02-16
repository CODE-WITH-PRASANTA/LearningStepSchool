const Award = require("../models/award.model");

/* ================= CREATE ================= */
exports.createAward = async (req, res) => {
  try {
    const award = await Award.create({
      title: req.body.title,
      image: req.file?.path,
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
    const updateData = {
      title: req.body.title,
    };

    if (req.file) {
      updateData.image = req.file.path;
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
    await Award.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Award deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};