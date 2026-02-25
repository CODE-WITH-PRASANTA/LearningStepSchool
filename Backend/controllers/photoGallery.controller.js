const PhotoGallery = require("../models/PhotoGallery.model");
const { deleteImageFile } = require("../middleware/upload");

/* ================= CREATE ================= */
exports.createPhoto = async (req, res) => {
  try {
    const { title, category, link, image } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    if (!title || !category) {
      return res.status(400).json({
        success: false,
        message: "Title and Category are required",
      });
    }

    const photo = await PhotoGallery.create({
      image,
      title,
      category,
      link,
    });

    res.status(201).json({
      success: true,
      data: photo,
    });

  } catch (err) {
    console.error("CREATE PHOTO ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================= GET ALL ================= */
exports.getPhotos = async (req, res) => {
  try {
    const photos = await PhotoGallery.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: photos,
    });

  } catch (err) {
    console.error("GET PHOTOS ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================= UPDATE ================= */
exports.updatePhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, link, image } = req.body;

    const photo = await PhotoGallery.findById(id);

    if (!photo) {
      return res.status(404).json({
        success: false,
        message: "Photo not found",
      });
    }

    // 🔥 Replace image if new uploaded
    if (image) {
      deleteImageFile(photo.image); // delete old image
      photo.image = image;
    }

    // 🔥 Update fields safely
    if (title !== undefined) photo.title = title;
    if (category !== undefined) photo.category = category;
    if (link !== undefined) photo.link = link;

    await photo.save();

    res.status(200).json({
      success: true,
      data: photo,
    });

  } catch (err) {
    console.error("UPDATE PHOTO ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================= DELETE ================= */
exports.deletePhoto = async (req, res) => {
  try {
    const { id } = req.params;

    const photo = await PhotoGallery.findById(id);

    if (!photo) {
      return res.status(404).json({
        success: false,
        message: "Photo not found",
      });
    }

    // 🔥 Delete image safely
    deleteImageFile(photo.image);

    await PhotoGallery.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Photo deleted successfully",
    });

  } catch (err) {
    console.error("DELETE PHOTO ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};