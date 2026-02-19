const fs = require("fs");
const Notice = require("../models/Notice");

/* ================= CREATE ================= */
exports.createNotice = async (req, res) => {
  try {
    const {
      title,
      description,
      name,
      designation,
      dateTime,
      location,
      expiry,
    } = req.body;

    if (!title || !description || !dateTime || !name || !designation) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const notice = await Notice.create({
      title,
      description,
      name,
      designation,
      dateTime,
      location,
      expiry,
      image: req.file ? req.file.path : null,
      isActive: expiry ? new Date(expiry) > new Date() : true,
    });

    res.status(201).json({
      success: true,
      data: notice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET ALL ================= */
exports.getAllNotices = async (req, res) => {
  try {
    // Auto update expired notices
    await Notice.updateMany(
      { expiry: { $lt: new Date() } },
      { isActive: false }
    );

    const notices = await Notice.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: notices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET ONE ================= */
exports.getNoticeById = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }

    res.json({
      success: true,
      data: notice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= UPDATE ================= */
exports.updateNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }

    const updateData = {
      ...req.body,
    };

    // Handle expiry auto active toggle
    if (req.body.expiry) {
      updateData.isActive =
        new Date(req.body.expiry) > new Date();
    }

    // Replace image if new one uploaded
    if (req.file) {
      if (notice.image && fs.existsSync(notice.image)) {
        fs.unlinkSync(notice.image);
      }
      updateData.image = req.file.path;
    }

    const updated = await Notice.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= DELETE ================= */
exports.deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }

    // Delete image file
    if (notice.image && fs.existsSync(notice.image)) {
      fs.unlinkSync(notice.image);
    }

    await Notice.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Notice deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};