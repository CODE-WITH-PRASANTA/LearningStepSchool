const VideoGallery = require("../models/videoGallery.model");

/* ================= CREATE ================= */
exports.createVideo = async (req, res) => {
  try {
    const { videoUrl, title, category } = req.body;

    if (!videoUrl || !title || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const video = await VideoGallery.create({
      videoUrl,
      title,
      category,
    });

    res.status(201).json(video);
  } catch (err) {
    console.error("CREATE VIDEO ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

/* ================= GET ALL ================= */
exports.getVideos = async (req, res) => {
  try {
    const videos = await VideoGallery.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    console.error("GET VIDEO ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

/* ================= UPDATE ================= */
exports.updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { videoUrl, title, category } = req.body;

    const updated = await VideoGallery.findByIdAndUpdate(
      id,
      { videoUrl, title, category },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("UPDATE VIDEO ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

/* ================= DELETE ================= */
exports.deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await VideoGallery.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.json({ message: "Video deleted successfully" });
  } catch (err) {
    console.error("DELETE VIDEO ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};