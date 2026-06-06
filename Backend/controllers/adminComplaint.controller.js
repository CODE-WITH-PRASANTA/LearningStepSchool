const AdminComplaint = require("../models/adminComplaint.model");

/* CREATE */
exports.createComplaint = async (req, res) => {
  try {
    const data = await AdminComplaint.create(req.body);

    res.status(201).json({
      success: true,
      message: "Complaint Added Successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* GET ALL */
exports.getAllComplaints = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || "";

    const query = {
      $or: [
        {
          complaintAgainst: {
            $regex: search,
            $options: "i",
          },
        },
        {
          complaintType: {
            $regex: search,
            $options: "i",
          },
        },
        {
          complaintMsg: {
            $regex: search,
            $options: "i",
          },
        },
      ],
    };

    const total =
      await AdminComplaint.countDocuments(query);

    const data = await AdminComplaint.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* GET BY ID */
exports.getComplaintById = async (req, res) => {
  try {
    const data = await AdminComplaint.findById(
      req.params.id
    );

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Complaint Not Found",
      });
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* UPDATE */
exports.updateComplaint = async (req, res) => {
  try {
    const data =
      await AdminComplaint.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    res.status(200).json({
      success: true,
      message: "Complaint Updated Successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* DELETE */
exports.deleteComplaint = async (req, res) => {
  try {
    await AdminComplaint.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Complaint Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};