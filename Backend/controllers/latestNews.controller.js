const LatestNews = require("../models/LatestNews");

/* CREATE */
exports.createNews = async (req, res) => {
  try {
    const news = await LatestNews.create(req.body);
    res.status(201).json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* GET ALL */
exports.getAllNews = async (req, res) => {
  try {
    const news = await LatestNews.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* DELETE */
exports.deleteNews = async (req, res) => {
  try {
    await LatestNews.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* TOGGLE ACTIVE */
exports.toggleNews = async (req, res) => {
  try {
    const news = await LatestNews.findById(req.params.id);
    news.isActive = !news.isActive;
    await news.save();

    res.status(200).json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
