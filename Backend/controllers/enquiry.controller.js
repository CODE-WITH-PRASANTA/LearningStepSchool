const Enquiry = require("../models/enquiry.model");

/* ================= CREATE ENQUIRY ================= */
exports.createEnquiry = async (req, res) => {
  try {
    const { name, address, phone, message } = req.body;

    if (!name || !address || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const enquiry = await Enquiry.create({
      name,
      address,
      phone,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Enquiry saved successfully",
      data: enquiry,
    });
  } catch (error) {
    console.error("CREATE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ================= GET ALL ENQUIRIES ================= */
exports.getEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: enquiries,
    });
  } catch (error) {
    console.error("GET ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ================= DELETE ENQUIRY ================= */
exports.deleteEnquiry = async (req, res) => {
  try {
    await Enquiry.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Enquiry deleted successfully",
    });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ================= UPDATE STATUS ================= */
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const updated = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Status updated",
      data: updated,
    });
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};