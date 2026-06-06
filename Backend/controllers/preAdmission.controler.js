const PreAdmission = require("./../models/preAdmission.model");

const { deleteImageFile } = require("./../middleware/upload");

exports.createPreAdmission = async (req, res) => {
  try {
   

    const photo = Array.isArray(req.body.photo)
      ? req.body.photo[0]
      : req.body.photo || "";

    const data = await PreAdmission.create({
      ...req.body,
      photo,
    });

    res.status(201).json({
      success: true,
      message: "Pre Admission created successfully",
      data,
    });
  } catch (error) {
    console.log("CREATE ERROR =>", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllPreAdmissions = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const search = req.query.search || "";

    const query = {
      $or: [
        {
          firstName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          lastName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          contactNo: {
            $regex: search,
            $options: "i",
          },
        },
      ],
    };

    const total = await PreAdmission.countDocuments(query);

    const data = await PreAdmission.find(query)
      .sort({
        createdAt: -1,
      })
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

exports.getPreAdmissionById = async (req, res) => {
  try {
    const data = await PreAdmission.findById(req.params.id);

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

exports.updatePreAdmission = async (req, res) => {
  try {
    const existing = await PreAdmission.findById(
      req.params.id
    );

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    const updateData = {
      ...req.body,
    };

    if (req.body.photo) {
      const photo = Array.isArray(req.body.photo)
        ? req.body.photo[0]
        : req.body.photo;

      if (existing.photo) {
        deleteImageFile(existing.photo);
      }

      updateData.photo = photo;
    }

    const updated =
      await PreAdmission.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

    res.status(200).json({
      success: true,
      message: "Updated successfully",
      data: updated,
    });
  } catch (error) {
    console.log("UPDATE ERROR =>", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deletePreAdmission = async (req, res) => {
  try {
    const data = await PreAdmission.findById(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    if (data.photo) {
      deleteImageFile(data.photo);
    }

    await PreAdmission.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
