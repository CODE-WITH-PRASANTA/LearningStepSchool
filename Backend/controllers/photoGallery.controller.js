const fs = require("fs");
const PhotoGallery = require("../models/photoGallery.model");

/* ================= CREATE ================= */
exports.createPhoto = async (req, res) => {
  try {
    const { title, category, link } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    if (!title || !category) {
      return res.status(400).json({ message: "Title and Category are required" });
    }

    const photo = await PhotoGallery.create({
      image: req.file.path,
      title,
      category,
      link,
    });

    res.status(201).json(photo);
  } catch (err) {
    console.error("CREATE PHOTO ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

/* ================= GET ALL ================= */
exports.getPhotos = async (req, res) => {
  try {
    const photos = await PhotoGallery.find().sort({ createdAt: -1 });
    res.status(200).json(photos);
  } catch (err) {
    console.error("GET PHOTOS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

/* ================= UPDATE ================= */
exports.updatePhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, link } = req.body;

    const photo = await PhotoGallery.findById(id);

    if (!photo) {
      return res.status(404).json({ message: "Photo not found" });
    }

    const updateData = {
      title,
      category,
      link,
    };

    // 🔥 If new image uploaded
    if (req.file) {
      // Delete old image
      if (photo.image && fs.existsSync(photo.image)) {
        fs.unlinkSync(photo.image);
      }

      updateData.image = req.file.path;
    }

    const updatedPhoto = await PhotoGallery.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    res.status(200).json(updatedPhoto);
  } catch (err) {
    console.error("UPDATE PHOTO ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

/* ================= DELETE ================= */
exports.deletePhoto = async (req, res) => {
  try {
    const { id } = req.params;

    const photo = await PhotoGallery.findById(id);

    if (!photo) {
      return res.status(404).json({ message: "Photo not found" });
    }

    // 🔥 Delete image file from folder
    if (photo.image && fs.existsSync(photo.image)) {
      fs.unlinkSync(photo.image);
    }

    await PhotoGallery.findByIdAndDelete(id);

    res.status(200).json({ message: "Photo deleted successfully" });
  } catch (err) {
    console.error("DELETE PHOTO ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};