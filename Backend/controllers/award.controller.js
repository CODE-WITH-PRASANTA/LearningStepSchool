const Award = require("../models/award.model");
const { deleteImageFile } = require("../middleware/upload");

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
      image,
    });

    res.status(201).json({
      success: true,
      data: award,
    });

  } catch (error) {
    console.error("CREATE AWARD ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
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
    console.error("GET AWARDS ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
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

    const { title, image } = req.body;

    // 🔥 Replace image if new uploaded
    if (image) {
      deleteImageFile(award.image); // delete old image
      award.image = image;
    }

    // 🔥 Safe update
    if (title !== undefined) award.title = title;

    await award.save();

    res.status(200).json({
      success: true,
      data: award,
    });

  } catch (error) {
    console.error("UPDATE AWARD ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
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

    // 🔥 Delete image safely
    deleteImageFile(award.image);

    await Award.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Award deleted successfully",
    });

  } catch (error) {
    console.error("DELETE AWARD ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};