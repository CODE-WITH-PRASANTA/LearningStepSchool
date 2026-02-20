const fs = require("fs");
const ClassData = require("../models/classData.model");

/* CREATE */
exports.createClassData = async (req, res) => {
  try {
    const data = await ClassData.create({
      ...req.body,
      image: req.file ? req.file.path : null,
    });

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET ALL */
exports.getClassData = async (req, res) => {
  try {
    const data = await ClassData.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* UPDATE */
exports.updateClassData = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await ClassData.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Not found" });
    }

    const updateData = {
      title: req.body.title,
      description: req.body.description,
      age: req.body.age,
      weekly: req.body.weekly,
      timeManagement: req.body.timeManagement,
    };

    // If new image uploaded
    if (req.file && req.file.path) {
      // delete old image
      if (item.image && fs.existsSync(item.image)) {
        fs.unlinkSync(item.image);
      }

      updateData.image = req.file.path;
    }

    const updated = await ClassData.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    res.json(updated);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* DELETE */
exports.deleteClassData = async (req, res) => {
  try {
    const item = await ClassData.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });

    if (item.image && fs.existsSync(item.image)) {
      fs.unlinkSync(item.image);
    }

    await ClassData.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};