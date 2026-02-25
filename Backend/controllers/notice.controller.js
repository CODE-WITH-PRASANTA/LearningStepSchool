const Notice = require("../models/Notice");
const { deleteImageFile } = require("../middleware/upload");

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
      image,
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
      image: image || null,
      isActive: expiry ? new Date(expiry) > new Date() : true,
    });

    res.status(201).json({
      success: true,
      data: notice,
    });

  } catch (error) {
    console.error("CREATE NOTICE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET ALL ================= */
exports.getAllNotices = async (req, res) => {
  try {
    // 🔥 Auto deactivate expired notices
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
    console.error("GET NOTICES ERROR:", error);
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
    console.error("GET NOTICE ERROR:", error);
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

    const {
      title,
      description,
      name,
      designation,
      dateTime,
      location,
      expiry,
      image,
    } = req.body;

    // 🔥 Replace image if new uploaded
    if (image) {
      deleteImageFile(notice.image); // delete old image
      notice.image = image;
    }

    // 🔥 Safe field updates
    if (title !== undefined) notice.title = title;
    if (description !== undefined) notice.description = description;
    if (name !== undefined) notice.name = name;
    if (designation !== undefined) notice.designation = designation;
    if (dateTime !== undefined) notice.dateTime = dateTime;
    if (location !== undefined) notice.location = location;
    if (expiry !== undefined) {
      notice.expiry = expiry;
      notice.isActive = new Date(expiry) > new Date();
    }

    await notice.save();

    res.json({
      success: true,
      data: notice,
    });

  } catch (error) {
    console.error("UPDATE NOTICE ERROR:", error);
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

    // 🔥 Delete image safely
    deleteImageFile(notice.image);

    await Notice.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Notice deleted successfully",
    });

  } catch (error) {
    console.error("DELETE NOTICE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};