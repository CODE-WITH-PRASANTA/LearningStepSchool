const fs = require("fs");
const PhotoGallery = require("../models/photoGallery.model");

/* ================= CREATE ================= */
exports.createPhoto = async (req, res) => {
  try {
    const { title, category, link, image } = req.body;

    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }

    if (!title || !category) {
      return res.status(400).json({
        message: "Title and Category are required",
      });
    }

    const photo = await PhotoGallery.create({
      image, // ✅ use middleware value
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
    const { title, category, link, image } = req.body;

    const photo = await PhotoGallery.findById(id);

    if (!photo) {
      return res.status(404).json({ message: "Photo not found" });
    }

    const updateData = { title, category, link };

    // ✅ If new image uploaded
    if (image) {
      // Delete old file
      if (photo.image) {
        const oldPath = photo.image.startsWith("/")
          ? photo.image.slice(1)
          : photo.image;

        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      updateData.image = image;
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

    // Delete image file
    if (photo.image) {
      const filePath = photo.image.startsWith("/")
        ? photo.image.slice(1)
        : photo.image;

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await PhotoGallery.findByIdAndDelete(id);

    res.status(200).json({ message: "Photo deleted successfully" });
  } catch (err) {
    console.error("DELETE PHOTO ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};