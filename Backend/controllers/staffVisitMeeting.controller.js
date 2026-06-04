const StaffVisitMeeting = require(
  "../models/staffVisitMeeting.model"
);

/* CREATE */

exports.createVisit = async (req, res) => {
  try {

    const data =
      await StaffVisitMeeting.create(
        req.body
      );

    res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    console.log(
      "CREATE ERROR =>",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* GET ALL */

exports.getAllVisits = async (req, res) => {
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
          employeeName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          schoolName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          remark: {
            $regex: search,
            $options: "i",
          },
        },
      ],
    };

    const total =
      await StaffVisitMeeting.countDocuments(
        query
      );

    const data =
      await StaffVisitMeeting.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

    res.status(200).json({
      success: true,
      total,
      page,
      totalPages: Math.ceil(
        total / limit
      ),
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* GET SINGLE */

exports.getVisitById = async (
  req,
  res
) => {
  try {
    const data =
      await StaffVisitMeeting.findById(
        req.params.id
      );

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
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

exports.updateVisit = async (
  req,
  res
) => {
  try {
    const data =
      await StaffVisitMeeting.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Visit updated successfully",
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

exports.deleteVisit = async (
  req,
  res
) => {
  try {
    const data =
      await StaffVisitMeeting.findByIdAndDelete(
        req.params.id
      );

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Visit deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};