const ClassData = require("../models/classData.model");
const { deleteImageFile } = require("../middleware/upload");

/* ================= CREATE ================= */
exports.createClassData = async (req, res) => {
  try {
    const newData = await ClassData.create({
      ...req.body,
      image: req.file ? req.file.path : null,
    });

    res.status(201).json({
      success: true,
      data: newData,
    });

  } catch (error) {
    console.error("CREATE CLASS DATA ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET ALL ================= */
exports.getClassData = async (req, res) => {
  try {
    const data = await ClassData.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data,
    });

  } catch (error) {
    console.error("GET CLASS DATA ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= UPDATE ================= */
exports.updateClassData = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await ClassData.findById(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Class data not found",
      });
    }

    // 🔥 Replace image if new uploaded
    if (req.file?.path) {
      deleteImageFile(item.image); // delete old image
      item.image = req.file.path;
    }

    // 🔥 Safe field updates
    const fields = [
      "title",
      "description",
      "age",
      "weekly",
      "timeManagement",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        item[field] = req.body[field];
      }
    });

    await item.save();

    res.json({
      success: true,
      data: item,
    });

  } catch (error) {
    console.error("UPDATE CLASS DATA ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= DELETE ================= */
exports.deleteClassData = async (req, res) => {
  try {
    const item = await ClassData.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Class data not found",
      });
    }

    // 🔥 Delete image safely
    deleteImageFile(item.image);

    await ClassData.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Deleted successfully",
    });

  } catch (error) {
    console.error("DELETE CLASS DATA ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};