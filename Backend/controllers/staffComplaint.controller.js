const StaffComplaint = require(
  "../models/staffComplaint.model"
);

/* CREATE */
exports.createComplaint = async (req, res) => {
  try {
    const data = await StaffComplaint.create(
      req.body
    );

    res.status(201).json({
      success: true,
      message:
        "Complaint Added Successfully",
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
exports.getAllComplaints = async (
  req,
  res
) => {
  try {
    const page =
      Number(req.query.page) || 1;

    const limit =
      Number(req.query.limit) || 10;

    const search =
      req.query.search || "";

    const query = {
      $or: [
        {
          staffName: {
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
          complaintText: {
            $regex: search,
            $options: "i",
          },
        },
      ],
    };

    const total =
      await StaffComplaint.countDocuments(
        query
      );

    const data =
      await StaffComplaint.find(query)
        .sort({
          createdAt: -1,
        })
        .skip(
          (page - 1) * limit
        )
        .limit(limit);

    res.status(200).json({
      success: true,
      total,
      page,
      totalPages:
        Math.ceil(total / limit),
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
exports.getComplaintById = async (
  req,
  res
) => {
  try {
    const data =
      await StaffComplaint.findById(
        req.params.id
      );

    if (!data) {
      return res.status(404).json({
        success: false,
        message:
          "Complaint Not Found",
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
exports.updateComplaint = async (
  req,
  res
) => {
  try {
    const data =
      await StaffComplaint.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    res.status(200).json({
      success: true,
      message:
        "Complaint Updated Successfully",
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
exports.deleteComplaint = async (
  req,
  res
) => {
  try {
    await StaffComplaint.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message:
        "Complaint Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
/* ADD COMPLAINT TYPE */
exports.addComplaintType = async (
  req,
  res
) => {
  try {
    const { complaintType } = req.body;

    const exists =
      await StaffComplaint.findOne({
        complaintType,
      });

    if (exists) {
      return res.status(400).json({
        success: false,
        message:
          "Complaint Type already exists",
      });
    }

    const data =
      await StaffComplaint.create({
        staffName: "System",
        department: "System",
        complaintType,
        complaintText:
          "Complaint Type Master",
        status: "Pending",
      });

    res.status(201).json({
      success: true,
      message:
        "Complaint Type Added Successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* GET COMPLAINT TYPES */
exports.getComplaintTypes =
  async (req, res) => {
    try {
      const data =
        await StaffComplaint.distinct(
          "complaintType"
        );

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

  /* UPDATE COMPLAINT TYPE */
exports.updateComplaintType =
  async (req, res) => {
    try {
      const { oldType, newType } =
        req.body;

      await StaffComplaint.updateMany(
        {
          complaintType: oldType,
        },
        {
          complaintType: newType,
        }
      );

      res.status(200).json({
        success: true,
        message:
          "Complaint Type Updated Successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

  /* DELETE COMPLAINT TYPE */
exports.deleteComplaintType =
  async (req, res) => {
    try {
      await StaffComplaint.deleteMany({
        complaintType:
          req.params.type,
      });

      res.status(200).json({
        success: true,
        message:
          "Complaint Type Deleted Successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };