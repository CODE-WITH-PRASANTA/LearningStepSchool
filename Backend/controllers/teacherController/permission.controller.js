// controllers/permission.controller.js

const Permission = require("../../models/techerModel/permission.model");

exports.createPermission = async (req, res) => {
  try {
    const { name, label } = req.body;

    const exists = await Permission.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: "Permission already exists" });
    }

    const permission = await Permission.create({ name, label });

    res.json({
        message: "Permission created successfully",
        permission,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find().sort({ createdAt: -1 });

    res.json(permissions);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updatePermission = async (req, res) => {
  try {
    const { name, label } = req.body;

    const permission = await Permission.findById(req.params.id);

    if (!permission) {
      return res.status(404).json({ message: "Permission not found" });
    }

    // ✅ update fields
    if (name) permission.name = name;
    if (label) permission.label = label;

    await permission.save();

    res.json({
      message: "Permission updated",
      permission,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deletePermission = async (req, res) => {
  try {
    const permission = await Permission.findByIdAndDelete(req.params.id);

    if (!permission) {
      return res.status(404).json({ message: "Permission not found" });
    }

    res.json({
      message: "Permission deleted successfully",
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};