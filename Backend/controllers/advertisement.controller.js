const Advertisement = require("../models/advertisement.model");
const { deleteImageFile } = require("../middleware/upload");

/* ================= CREATE ================= */
exports.createAdvertisement = async (req, res) => {
  try {
    const ad = await Advertisement.create({
      image: req.body.image,
      title: req.body.title,
    });

    res.status(201).json({
      success: true,
      data: ad,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

"bg-green-500 hover:bg-green-600 text-white"



exports.toggleAdvertisement = async (req, res) => {
  try {
    const ad = await Advertisement.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: "Advertisement not found"
      });
    }

    ad.active = !ad.active;

    await ad.save();

    res.json({
      success: true,
      data: ad
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



/* ================= GET ALL ================= */
exports.getAdvertisements = async (req, res) => {
  try {
    const ads = await Advertisement.find({ active: true }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: ads,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================= DELETE ================= */
exports.deleteAdvertisement = async (req, res) => {
  try {
    const ad = await Advertisement.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: "Advertisement not found",
      });
    }

    deleteImageFile(ad.image);

    await ad.deleteOne();

    res.json({
      success: true,
      message: "Advertisement deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};