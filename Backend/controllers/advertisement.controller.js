const Advertisement = require("../models/advertisement.model");
const { deleteImageFile } = require("../middleware/upload");

/* ================= CREATE ADVERTISEMENT ================= */

exports.createAdvertisement = async (req, res) => {
  try {

    if (!req.body.image) {
      return res.status(400).json({
        success: false,
        message: "Advertisement image is required",
      });
    }

    const ad = await Advertisement.create({
      image: req.body.image,
      title: req.body.title || "",
    });

    return res.status(201).json({
      success: true,
      message: "Advertisement created successfully",
      data: ad,
    });

  } catch (error) {
    console.error("CREATE AD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* ================= GET ALL ADS ================= */

exports.getAdvertisements = async (req, res) => {
  try {
    const ads = await Advertisement.find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: ads.length,
      data: ads,
    });
  } catch (error) {
    console.error("GET ADS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch advertisements",
    });
  }
};




/* ================= TOGGLE ACTIVE STATUS ================= */

exports.toggleAdvertisement = async (req, res) => {
  try {
    const ad = await Advertisement.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: "Advertisement not found",
      });
    }

    ad.active = !ad.active;
    await ad.save();

    return res.status(200).json({
      success: true,
      message: "Advertisement status updated",
      data: ad,
    });
  } catch (error) {
    console.error("TOGGLE AD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update advertisement status",
    });
  }
};




/* ================= DELETE ADVERTISEMENT ================= */

exports.deleteAdvertisement = async (req, res) => {
  try {
    const ad = await Advertisement.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: "Advertisement not found",
      });
    }

    /* delete image from uploads */
    if (ad.image) {
      deleteImageFile(ad.image);
    }

    await ad.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Advertisement deleted successfully",
    });
  } catch (error) {
    console.error("DELETE AD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete advertisement",
    });
  }
};